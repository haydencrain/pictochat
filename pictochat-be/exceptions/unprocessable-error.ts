/**
 * Throw a `UnprocessableError` when a request cannot be processed
 */
export class UnprocessableError {
  static readonly ERROR_TYPE = 'UNPROCESSABLE_ERROR';
  static readonly DEFAULT_MESSAGE = 'Unable to process request';
  message: string;
  errorType: string;
  constructor(message: string = UnprocessableError.DEFAULT_MESSAGE) {
    // super(message);
    // Object.setPrototypeOf(this, new.target.prototype);
    this.errorType = UnprocessableError.ERROR_TYPE;
    this.message = message;
  }
}
