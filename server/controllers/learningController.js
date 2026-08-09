import { Course, Progress } from '../models/index.js';
import { ok } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const listCourses = asyncHandler(async (_req, res) => {
  const courses = await Course.find({ isPublished: true }).sort('pillar level title').lean();
  ok(res, courses, 'Courses');
});

export const updateProgress = asyncHandler(async (req, res) => {
  const progress = await Progress.findOneAndUpdate(
    {
      organization: req.organizationId,
      user: req.user._id,
      course: req.body.course,
      lesson: req.body.lesson,
    },
    {
      organization: req.organizationId,
      user: req.user._id,
      course: req.body.course,
      module: req.body.module,
      lesson: req.body.lesson,
      status: req.body.status,
      percentComplete: req.body.percentComplete,
    },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
  );

  ok(res, progress, 'Progress updated');
});
