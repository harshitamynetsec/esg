import { Course, Lesson, Module, Progress } from '../models/index.js';
import { ok } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const listCourses = asyncHandler(async (_req, res) => {
  const courses = await Course.find({ isPublished: true }).sort('pillar level title').lean();
  ok(res, courses, 'Courses');
});

export const getLearningHub = asyncHandler(async (req, res) => {
  const courses = await Course.find({ isPublished: true }).sort('pillar level title').lean();
  const courseIds = courses.map((course) => course._id);

  const modules = await Module.find({ course: { $in: courseIds } }).sort('order').lean();
  const moduleIds = modules.map((module) => module._id);

  const lessons = await Lesson.find({ module: { $in: moduleIds } }).sort('order').lean();

  const progress = req.organizationId
    ? await Progress.find({ organization: req.organizationId, user: req.user._id, course: { $in: courseIds } }).lean()
    : [];
  const progressByLesson = new Map(progress.filter((entry) => entry.lesson).map((entry) => [String(entry.lesson), entry]));

  const lessonsByModule = new Map();
  lessons.forEach((lesson) => {
    const key = String(lesson.module);
    const withProgress = { ...lesson, progress: progressByLesson.get(String(lesson._id)) || null };
    lessonsByModule.set(key, [...(lessonsByModule.get(key) || []), withProgress]);
  });

  const modulesByCourse = new Map();
  modules.forEach((module) => {
    const key = String(module.course);
    const withLessons = { ...module, lessons: lessonsByModule.get(String(module._id)) || [] };
    modulesByCourse.set(key, [...(modulesByCourse.get(key) || []), withLessons]);
  });

  const data = courses.map((course) => ({ ...course, modules: modulesByCourse.get(String(course._id)) || [] }));
  ok(res, data, 'Learning hub content');
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
