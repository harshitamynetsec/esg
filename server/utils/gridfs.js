import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';

const BUCKET_NAME = 'reportFiles';

const getReportBucket = () => new GridFSBucket(mongoose.connection.db, { bucketName: BUCKET_NAME });

export const uploadBufferToGridFS = (buffer, filename, metadata = {}) => new Promise((resolve, reject) => {
  const uploadStream = getReportBucket().openUploadStream(filename, { metadata });
  uploadStream.on('finish', () => resolve(uploadStream.id));
  uploadStream.on('error', reject);
  uploadStream.end(buffer);
});

export const streamGridFSFile = (fileId, res, { filename, contentType } = {}) => {
  const downloadStream = getReportBucket().openDownloadStream(fileId);
  downloadStream.on('error', () => {
    if (!res.headersSent) {
      res.status(404).json({ success: false, message: 'File not found', code: 'FILE_NOT_FOUND' });
    }
  });
  res.setHeader('Content-Type', contentType || 'application/octet-stream');
  if (filename) {
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  }
  downloadStream.pipe(res);
};
