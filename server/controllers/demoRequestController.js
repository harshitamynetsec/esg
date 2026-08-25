import { DemoRequest } from '../models/index.js';
import { created, ok } from '../utils/apiResponse.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getPagination, paginationMeta } from '../utils/pagination.js';

export const createDemoRequest = asyncHandler(async (req, res) => {
  const { fullName, workEmail, company, jobTitle, companySize, region, frameworks, notes } = req.body;
  const demoRequest = await DemoRequest.create({
    fullName,
    workEmail,
    company,
    jobTitle,
    companySize,
    region,
    frameworks: Array.isArray(frameworks) ? frameworks : [],
    notes,
  });
  created(res, demoRequest, 'Demo request received');
});

export const listDemoRequests = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const [items, total] = await Promise.all([
    DemoRequest.find().sort('-createdAt').skip(skip).limit(limit),
    DemoRequest.countDocuments(),
  ]);
  ok(res, items, 'Demo requests', 200, paginationMeta(page, limit, total));
});

export const updateDemoRequestStatus = asyncHandler(async (req, res) => {
  const demoRequest = await DemoRequest.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true },
  );
  if (!demoRequest) {
    throw new AppError('Demo request not found', 404, 'NOT_FOUND');
  }
  ok(res, demoRequest, 'Demo request updated');
});
