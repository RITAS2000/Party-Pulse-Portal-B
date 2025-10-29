import createHttpError from 'http-errors';

export function validateUser(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return next(createHttpError(400, error.details[0].message));
    }
    req.body = value;
    next();
  };
}
