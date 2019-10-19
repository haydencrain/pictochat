/**
 * Throw a `ForbiddenError` when a client lack permission to do something
 */
export class ForbiddenError {
  static readonly ERROR_TYPE = 'FORBIDDEN_ERROR';
  static readonly DEFAULT_MESSAGE = 'Request Unauthorised';
  message: string;
  errorType: string;
  constructor(message: string = ForbiddenError.DEFAULT_MESSAGE) {
    this.errorType = ForbiddenError.ERROR_TYPE;
    this.message = message;
  }
}
