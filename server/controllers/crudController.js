import { created, ok } from '../utils/apiResponse.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getPagination, paginationMeta } from '../utils/pagination.js';

const organizationScopedFilter = (req, extra = {}) => {
  if (req.user?.roleKey === 'platform_super_admin' && req.query.organization) {
    return { ...extra, organization: req.query.organization };
  }

  if (req.organizationId) {
    return { ...extra, organization: req.organizationId };
  }

  return extra;
};

export const createCrudController = (Model, options = {}) => {
  const {
    resourceName = Model.modelName,
    organizationScoped = true,
    searchFields = [],
    defaultSort = '-createdAt',
    populate = [],
    listFilter,
  } = options;

  const buildFilter = (req) => {
    const base = organizationScoped ? organizationScopedFilter(req) : {};
    if (!req.query.search || !searchFields.length) {
      return base;
    }

    return {
      ...base,
      $or: searchFields.map((field) => ({ [field]: { $regex: req.query.search, $options: 'i' } })),
    };
  };

  const applyPopulate = (query) => populate.reduce((nextQuery, field) => nextQuery.populate(field), query);

  return {
    list: asyncHandler(async (req, res) => {
      const { page, limit, skip } = getPagination(req.query);
      const filter = listFilter ? listFilter(req, buildFilter(req)) : buildFilter(req);
      const [items, total] = await Promise.all([
        applyPopulate(Model.find(filter).sort(req.query.sort || defaultSort).skip(skip).limit(limit)),
        Model.countDocuments(filter),
      ]);
      ok(res, items, `${resourceName} list`, 200, paginationMeta(page, limit, total));
    }),

    get: asyncHandler(async (req, res) => {
      const filter = organizationScoped ? organizationScopedFilter(req, { _id: req.params.id }) : { _id: req.params.id };
      const item = await applyPopulate(Model.findOne(filter));
      if (!item) {
        throw new AppError(`${resourceName} not found`, 404, 'NOT_FOUND');
      }
      ok(res, item, `${resourceName} detail`);
    }),

    create: asyncHandler(async (req, res) => {
      const payload = { ...req.body };
      if (organizationScoped && !payload.organization && req.organizationId) {
        payload.organization = req.organizationId;
      }
      const item = await Model.create(payload);
      created(res, item, `${resourceName} created`);
    }),

    update: asyncHandler(async (req, res) => {
      const filter = organizationScoped ? organizationScopedFilter(req, { _id: req.params.id }) : { _id: req.params.id };
      const item = await Model.findOneAndUpdate(filter, req.body, {
        new: true,
        runValidators: true,
      });
      if (!item) {
        throw new AppError(`${resourceName} not found`, 404, 'NOT_FOUND');
      }
      ok(res, item, `${resourceName} updated`);
    }),

    remove: asyncHandler(async (req, res) => {
      const filter = organizationScoped ? organizationScopedFilter(req, { _id: req.params.id }) : { _id: req.params.id };
      const item = await Model.findOneAndDelete(filter);
      if (!item) {
        throw new AppError(`${resourceName} not found`, 404, 'NOT_FOUND');
      }
      ok(res, { id: req.params.id }, `${resourceName} deleted`);
    }),
  };
};
