import mongoose from 'mongoose';
import { Schema, nameField, objectId, optionalText, timestamps } from './common.js';

const lessonSchema = new Schema(
  {
    course: objectId('Course', true),
    module: objectId('Module', true),
    title: nameField('Lesson title', 2, 160),
    content: { type: String, required: true, trim: true, minlength: 20, maxlength: 50000 },
    contentType: { type: String, enum: ['article', 'video', 'quiz'], default: 'article' },
    videoUrl: optionalText(500),
    durationMinutes: { type: Number, min: 1, required: true },
    order: { type: Number, min: 1, required: true },
  },
  timestamps,
);

lessonSchema.index({ module: 1, order: 1 }, { unique: true });

export const Lesson = mongoose.model('Lesson', lessonSchema);
