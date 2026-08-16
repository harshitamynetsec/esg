import { User } from '../models/index.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { verifyAccessToken } from '../utils/tokens.js';

export const authenticate = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : req.cookies?.accessToken;

  if (!token) {
    throw new AppError('Authentication required', 401, 'AUTH_REQUIRED');
  }

  let payload;
  try {
    payload = verifyAccessToken(token);
  } catch (error) {
    const isExpired = error.name === 'TokenExpiredError';
    throw new AppError(
      isExpired ? 'Session expired. Please sign in again.' : 'Authentication required',
      401,
      isExpired ? 'SESSION_EXPIRED' : 'AUTH_INVALID_TOKEN',
    );
  }
  const user = await User.findById(payload.sub).populate({ path: 'roles', populate: { path: 'permissions' } });

  if (!user || !user.isActive) {
    throw new AppError('User is inactive or no longer exists', 401, 'AUTH_INVALID_USER');
  }

  req.user = user;
  req.organizationId = user.organization?._id || user.organization;
  next();
});

export const authorize = (...permissionKeys) => (req, _res, next) => {
  if (!permissionKeys.length) {
    next();
    return;
  }

  if (req.user?.roleKey === 'platform_super_admin') {
    next();
    return;
  }

  const granted = new Set(
    (req.user?.roles || []).flatMap((role) => (role.permissions || []).map((permission) => permission.key)),
  );

  const allowed = permissionKeys.some((permission) => granted.has(permission));
  if (!allowed) {
    next(new AppError('You do not have permission to perform this action', 403, 'FORBIDDEN'));
    return;
  }

  next();
};
