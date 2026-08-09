import {
  Organization,
  Role,
  Session,
  User,
} from '../models/index.js';
import { created, ok } from '../utils/apiResponse.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/tokens.js';

const sessionExpiry = () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

const issueTokens = async (user, req) => {
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  await Session.create({
    user: user._id,
    refreshTokenHash: Session.hashToken(refreshToken),
    ipAddress: req.ip,
    userAgent: req.get('user-agent'),
    expiresAt: sessionExpiry(),
  });

  return { accessToken, refreshToken };
};

const serializeUser = async (user) => {
  const populated = await User.findById(user._id).populate('organization').populate({
    path: 'roles',
    populate: { path: 'permissions' },
  });
  return populated.toJSON();
};

export const register = asyncHandler(async (req, res) => {
  const existing = await User.findOne({ email: req.body.email });
  if (existing) {
    throw new AppError('Email is already registered', 409, 'EMAIL_EXISTS');
  }

  const organization = await Organization.create(req.body.organization);
  const adminRole = await Role.findOne({ key: 'organization_admin', organization: null });

  const user = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    organization: organization._id,
    roleKey: 'organization_admin',
    roles: adminRole ? [adminRole._id] : [],
    title: req.body.title,
    phone: req.body.phone,
  });

  const tokens = await issueTokens(user, req);
  created(res, { user: await serializeUser(user), tokens }, 'Registration complete');
});

export const login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).select('+password');
  if (!user || !(await user.comparePassword(req.body.password))) {
    throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  if (!user.isActive) {
    throw new AppError('Account is inactive', 403, 'ACCOUNT_INACTIVE');
  }

  user.lastLoginAt = new Date();
  await user.save();

  const tokens = await issueTokens(user, req);
  ok(res, { user: await serializeUser(user), tokens }, 'Login successful');
});

export const refresh = asyncHandler(async (req, res) => {
  const payload = verifyRefreshToken(req.body.refreshToken);
  const tokenHash = Session.hashToken(req.body.refreshToken);
  const session = await Session.findOne({ user: payload.sub, refreshTokenHash: tokenHash, revokedAt: null });

  if (!session || session.expiresAt < new Date()) {
    throw new AppError('Refresh token is invalid or expired', 401, 'INVALID_REFRESH_TOKEN');
  }

  const user = await User.findById(payload.sub);
  if (!user || !user.isActive) {
    throw new AppError('User is inactive or no longer exists', 401, 'AUTH_INVALID_USER');
  }

  session.revokedAt = new Date();
  await session.save();

  const tokens = await issueTokens(user, req);
  ok(res, { user: await serializeUser(user), tokens }, 'Token refreshed');
});

export const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.body.refreshToken;
  if (refreshToken) {
    await Session.findOneAndUpdate({ refreshTokenHash: Session.hashToken(refreshToken) }, { revokedAt: new Date() });
  }
  ok(res, null, 'Logout successful');
});

export const me = asyncHandler(async (req, res) => {
  ok(res, { user: await serializeUser(req.user) }, 'Current user');
});
