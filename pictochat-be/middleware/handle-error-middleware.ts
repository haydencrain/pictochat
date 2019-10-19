import { ForbiddenError } from "../exceptions/forbidden-error";
import { NotFoundError } from "../exceptions/not-found-error";
import { UnprocessableError } from "../exceptions/unprocessable-error";

export function handleErrorMiddleware(error, req, res, next) {
  if (!!error.errorType) {
    switch (error.errorType) {
      case ForbiddenError.ERROR_TYPE:
        return res.status(403).json(error);
      case NotFoundError.ERROR_TYPE:
        return res.status(404).json(error);
      case UnprocessableError.ERROR_TYPE:
        return res.status(422).json(error);
    }
  }
  next(error);
}
