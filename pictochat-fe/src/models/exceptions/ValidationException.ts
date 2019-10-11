/**
 * Creates a new Validation Exception
 * @class
 */
export default class ValidationException extends Error {
  static readonly ERROR_TYPE: string = 'VALIDATION_EXCEPTION';
  /**
   * Error Type, defaults to VALIDATION_EXCEPTION
   */
  errorType: string;
  /**
   * The message of the exception
   */
  message: string;
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.message = message;
    this.errorType = ValidationException.ERROR_TYPE;
  }
}
