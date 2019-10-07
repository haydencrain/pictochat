export class ForbiddenError {
  static readonly ERROR_TYPE = 'AUTHENTICATION_ERROR';
  static readonly DEFAULT_MESSAGE = 'Request Unauthorised';
  message: string;
  errorType: string;
  constructor(message: string = ForbiddenError.DEFAULT_MESSAGE) {
    // super(message);
    // Object.setPrototypeOf(this, new.target.prototype);
    this.errorType = ForbiddenError.ERROR_TYPE;

    this.message = message;
  }
}
