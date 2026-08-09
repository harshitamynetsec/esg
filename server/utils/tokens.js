import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const signAccessToken = (user) =>
  jwt.sign(
    {
      sub: user._id.toString(),
      organization: user.organization?.toString(),
      roleKey: user.roleKey,
    },
    env.jwtAccessSecret,
    { expiresIn: env.jwtAccessExpiresIn },
  );

export const signRefreshToken = (user) =>
  jwt.sign({ sub: user._id.toString(), nonce: crypto.randomUUID() }, env.jwtRefreshSecret, {
    expiresIn: env.jwtRefreshExpiresIn,
  });

export const verifyAccessToken = (token) => jwt.verify(token, env.jwtAccessSecret);

export const verifyRefreshToken = (token) => jwt.verify(token, env.jwtRefreshSecret);
