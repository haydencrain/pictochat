export default class ValidationException extends Error {
  static readonly ERROR_TYPE: string = 'VALIDATION_EXCEPTION';
  errorType: string;
  message: string;
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.message = message;
    this.errorType = ValidationException.ERROR_TYPE;
  }
}
