import { Upload } from '../models/index.js';
import { created } from '../utils/apiResponse.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createUpload = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError('File is required', 400, 'FILE_REQUIRED');
  }

  const upload = await Upload.create({
    organization: req.organizationId,
    uploadedBy: req.user._id,
    originalName: req.file.originalname,
    storedName: req.file.filename,
    mimeType: req.file.mimetype,
    size: req.file.size,
    path: req.file.path,
    category: req.body.category || 'other',
  });

  created(res, upload, 'File uploaded');
});
