import crypto from 'crypto';
import { Organization, Role, User } from '../models/index.js';
import { sendInvitationEmail } from '../services/emailService.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { created, ok } from '../utils/apiResponse.js';
import { env } from '../config/env.js';

const extractDomain = (emailStr) => {
  if (!emailStr || typeof emailStr !== 'string' || !emailStr.includes('@')) return '';
  return emailStr.split('@')[1].toLowerCase().trim();
};

const hashToken = (rawToken) => crypto.createHash('sha256').update(rawToken).digest('hex');

const isCompanyAdmin = (user) =>
  user.roleKey === 'organization_admin' || user.roleKey === 'platform_super_admin';

export const inviteMember = asyncHandler(async (req, res) => {
  if (!isCompanyAdmin(req.user)) {
    throw new AppError('Only organization admins can invite team members', 403, 'FORBIDDEN');
  }

  const organizationId = req.organizationId;
  if (!organizationId) {
    throw new AppError('Organization context required', 400, 'ORGANIZATION_REQUIRED');
  }

  const organization = await Organization.findById(organizationId);
  if (!organization) {
    throw new AppError('Organization not found', 404, 'ORGANIZATION_NOT_FOUND');
  }

  const requesterDomain = extractDomain(req.user.email);
  const orgContactDomain = extractDomain(organization.contactEmail);
  const invitedDomain = extractDomain(req.body.email);

  const isDomainMatch =
    invitedDomain === requesterDomain ||
    (orgContactDomain && invitedDomain === orgContactDomain);

  if (!isDomainMatch) {
    throw new AppError(
      `Invited email domain (@${invitedDomain}) must match company email domain (@${requesterDomain})`,
      400,
      'INVALID_EMAIL_DOMAIN',
    );
  }

  const existingUser = await User.findOne({ email: req.body.email });
  if (existingUser) {
    throw new AppError('Email is already registered or invited', 409, 'EMAIL_EXISTS');
  }

  const roleKey = req.body.roleKey || 'subscriber';
  const role = await Role.findOne({ key: roleKey, organization: null });

  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const newUser = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    organization: organizationId,
    roleKey,
    roles: role ? [role._id] : [],
    title: req.body.title,
    phone: req.body.phone,
    status: 'invited',
    isActive: true,
    isEmailVerified: false,
    inviteTokenHash: tokenHash,
    inviteTokenExpiresAt: expiresAt,
  });

  const setupUrl = `${env.clientUrl}/set-password?token=${rawToken}`;

  await sendInvitationEmail({
    to: newUser.email,
    firstName: newUser.firstName,
    setupUrl,
    companyName: organization.name,
  });

  const responseData = {
    user: newUser.toJSON(),
  };

  if (env.nodeEnv !== 'production') {
    responseData.setupUrl = setupUrl;
  }

  created(res, responseData, 'Team member invited successfully');
});

export const getTeamMembers = asyncHandler(async (req, res) => {
  const organizationId = req.organizationId;
  if (!organizationId) {
    throw new AppError('Organization context required', 400, 'ORGANIZATION_REQUIRED');
  }

  const members = await User.find({ organization: organizationId })
    .populate('roles')
    .sort('firstName lastName')
    .lean();

  ok(res, members, 'Team members retrieved');
});

export const updateTeamMember = asyncHandler(async (req, res) => {
  if (!isCompanyAdmin(req.user)) {
    throw new AppError('Only organization admins can update team members', 403, 'FORBIDDEN');
  }

  const { id } = req.params;
  const organizationId = req.organizationId;

  const member = await User.findOne({ _id: id, organization: organizationId });
  if (!member) {
    throw new AppError('Team member not found', 404, 'NOT_FOUND');
  }

  const allowedFields = ['firstName', 'lastName', 'roleKey', 'title', 'phone'];
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      member[field] = req.body[field];
    }
  });

  if (req.body.roleKey) {
    const role = await Role.findOne({ key: req.body.roleKey, organization: null });
    if (role) {
      member.roles = [role._id];
    }
  }

  await member.save();
  const updated = await User.findById(member._id).populate('roles').lean();
  ok(res, updated, 'Team member updated');
});

export const updateTeamMemberStatus = asyncHandler(async (req, res) => {
  if (!isCompanyAdmin(req.user)) {
    throw new AppError('Only organization admins can change member status', 403, 'FORBIDDEN');
  }

  const { id } = req.params;
  const organizationId = req.organizationId;

  const member = await User.findOne({ _id: id, organization: organizationId });
  if (!member) {
    throw new AppError('Team member not found', 404, 'NOT_FOUND');
  }

  if (String(member._id) === String(req.user._id)) {
    throw new AppError('You cannot deactivate your own account', 400, 'CANNOT_DEACTIVATE_SELF');
  }

  if (req.body.status !== undefined) {
    member.status = req.body.status;
    member.isActive = req.body.status === 'active';
  } else if (req.body.isActive !== undefined) {
    member.isActive = Boolean(req.body.isActive);
    member.status = member.isActive ? 'active' : 'inactive';
  }

  await member.save();
  const updated = await User.findById(member._id).populate('roles').lean();
  ok(res, updated, 'Team member status updated');
});

export const resendInvite = asyncHandler(async (req, res) => {
  if (!isCompanyAdmin(req.user)) {
    throw new AppError('Only organization admins can resend invitations', 403, 'FORBIDDEN');
  }

  const { id } = req.params;
  const organizationId = req.organizationId;

  const member = await User.findOne({ _id: id, organization: organizationId }).select(
    '+inviteTokenHash +inviteTokenExpiresAt',
  );
  if (!member) {
    throw new AppError('Team member not found', 404, 'NOT_FOUND');
  }

  if (member.status !== 'invited') {
    throw new AppError('User invitation has already been completed or account is active', 400, 'ALREADY_ACTIVE');
  }

  const organization = await Organization.findById(organizationId);

  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  member.inviteTokenHash = tokenHash;
  member.inviteTokenExpiresAt = expiresAt;
  await member.save();

  const setupUrl = `${env.clientUrl}/set-password?token=${rawToken}`;

  await sendInvitationEmail({
    to: member.email,
    firstName: member.firstName,
    setupUrl,
    companyName: organization?.name,
  });

  const responseData = {
    message: 'Invitation resent successfully',
  };

  if (env.nodeEnv !== 'production') {
    responseData.setupUrl = setupUrl;
  }

  ok(res, responseData, 'Invitation resent successfully');
});
