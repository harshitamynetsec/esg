export const ok = (res, data, message = 'OK', status = 200, meta) => {
  res.status(status).json({ success: true, message, data, meta });
};

export const created = (res, data, message = 'Created') => ok(res, data, message, 201);
