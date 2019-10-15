import * as EmailValidator from 'email-validator';
import { UnprocessableError } from '../exceptions/unprocessable-error';
/**
 * Use this to check the field validation of the user register form
 * @param req
 * @param res
 * @param next
 */
export async function registerUserMiddleware(req, res, next) {
  const { username, email, password } = req.body;
  if (!EmailValidator.validate(email)) {
    next(new UnprocessableError('Email is invalid!'));
    return;
  }

  next();
}
