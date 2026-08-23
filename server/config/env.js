import dotenv from 'dotenv';

dotenv.config();

const numberFromEnv = (name, fallback) => {
  const value = Number(process.env[name]);
  return Number.isFinite(value) ? value : fallback;
};

const requiredInProduction = ['MONGODB_URI', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'];

if (process.env.NODE_ENV === 'production') {
  requiredInProduction.forEach((name) => {
    if (!process.env[name]) {
      throw new Error(`Missing required environment variable: ${name}`);
    }
  });
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: numberFromEnv('PORT', 5000),
  clientUrl: process.env.CLIENT_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://esg-amber.vercel.app'),
  mongoUri: process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb+srv://mithleshsaini_db_user:mithleshsaini_db_user@cluster0.orts1zc.mongodb.net/?appName=Cluster0',
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'dev-access-secret-change-before-production',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-before-production',
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  bcryptSaltRounds: numberFromEnv('BCRYPT_SALT_ROUNDS', 12),
  uploadDir: process.env.UPLOAD_DIR || 'server/uploads',
  maxFileSizeMb: numberFromEnv('MAX_FILE_SIZE_MB', 10),
  smtp: {
    host: process.env.SMTP_HOST || '',
    port: numberFromEnv('SMTP_PORT', 587),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.SMTP_FROM || 'ESG-NSS <noreply@esg-nss.local>',
  },
};
