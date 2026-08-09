import mongoose from 'mongoose';
import { Schema, esgPillars, lifecycleStatuses, nameField, objectId, optionalText, timestamps } from './common.js';

const materialTopicSchema = new Schema(
  {
    organization: objectId('Organization'), // Note: removed 'true' (required) if these are global templates
    title: nameField('Material topic title', 2, 140),
    description: optionalText(1200),
    pillar: { type: String, enum: esgPillars, required: true },
    impactScore: { type: Number, min: 1, max: 5, default: 3 }, // Added default 3
    stakeholderPriority: { type: Number, min: 1, max: 5, default: 3 }, // Added default 3
    financialMateriality: { type: Number, min: 1, max: 5, default: 3 },
    sdgs: [objectId('SDG')],
    owner: objectId('User'),
    status: { type: String, enum: lifecycleStatuses, default: 'active' },

    // --- NEW FIELDS ADDED FROM FIRESTORE ---
    serialNum: { type: Number },
    color: { type: String, trim: true, match: [/^#[0-9A-Fa-f]{6}$/, 'Color must be a hex code'] },
  },
  timestamps,
);

materialTopicSchema.index({ organization: 1, pillar: 1 });
materialTopicSchema.index({ organization: 1, title: 1 }, { unique: true });

export const MaterialTopic = mongoose.model('MaterialTopic', materialTopicSchema);