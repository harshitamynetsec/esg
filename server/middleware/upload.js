import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { env } from '../config/env.js';

fs.mkdirSync(env.uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, env.uploadDir),
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname);
    const base = path.basename(file.originalname, extension).replace(/[^a-z0-9]+/gi, '-').toLowerCase();
    callback(null, `${Date.now()}-${base}${extension}`);
  },
});

const allowedTypes = new Set([
  'application/pdf',
  'image/png',
  'image/jpeg',
  'text/csv',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

export const upload = multer({
  storage,
  limits: { fileSize: env.maxFileSizeMb * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (!allowedTypes.has(file.mimetype)) {
      callback(new Error('Unsupported file type'));
      return;
    }
    callback(null, true);
  },
});
