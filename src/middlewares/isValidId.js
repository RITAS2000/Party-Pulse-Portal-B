import { isValidObjectId } from 'mongoose';

export function isValidId(req, res, next) {
  if (isValidObjectId(req.params.id) !== true) {
    return res.status(400).json({ status: 400, message: 'Id is not valid' });
  }
  next();
}
