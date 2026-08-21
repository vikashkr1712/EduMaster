import { ApiError } from '../utils/ApiError.js';

export const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const data = req[source];
    const result = schema.safeParse(data);

    if (!result.success) {
      const errors = result.error.issues.map((error) => ({
        field: error.path.join('.'),
        message: error.message,
      }));
      throw new ApiError(400, 'Validation failed', errors);
    }

    if (source === 'query') {
      Object.keys(req.query).forEach((key) => delete req.query[key]);
      Object.assign(req.query, result.data);
    } else {
      req[source] = result.data;
    }
    next();
  };
};
