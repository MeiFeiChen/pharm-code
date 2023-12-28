import { validationResult } from 'express-validator'

export default function handleResult(req, res, next) {
  const errorFormatter = ({ location, msg, path }) => `${location}[${path}]: ${msg}`
  const result = validationResult(req).formatWith(errorFormatter);
  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }
  return next();
}
