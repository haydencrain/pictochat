export class UnprocessableError extends Error {
  static readonly ERROR_TYPE = 'NOT_FOUND_ERROR';
  static readonly DEFAULT_MESSAGE = 'Unable to process request';
  message: string;
  errorType: string;
  constructor(message: string = UnprocessableError.DEFAULT_MESSAGE) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.errorType = UnprocessableError.ERROR_TYPE;
  }
}
