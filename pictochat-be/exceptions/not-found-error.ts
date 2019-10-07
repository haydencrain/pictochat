export class NotFoundError {
  static readonly ERROR_TYPE = 'NOT_FOUND_ERROR';
  static readonly DEFAULT_MESSAGE = 'Not Found';
  message: string;
  errorType: string;
  constructor(message: string = NotFoundError.DEFAULT_MESSAGE) {
    // super(message);
    // Object.setPrototypeOf(this, new.target.prototype);
    this.errorType = NotFoundError.ERROR_TYPE;
    this.message = message;
  }
}
