export enum AuthErrorMessageTypes {
  INCORRECT_CREDENTIALS,
  DUPLICATE_USERNAME,
  USER_DISABLED
}

/**
 * Throw a `AuthError` when user authorisation errors occur
 */
export class AuthError {
  static readonly ERROR_TYPE = 'AUTH_ERROR';
  static readonly DEFAULT_MESSAGE = AuthErrorMessageTypes.INCORRECT_CREDENTIALS;
  messageType: AuthErrorMessageTypes;
  errorType: string;
  constructor(message: AuthErrorMessageTypes = AuthError.DEFAULT_MESSAGE) {
    this.errorType = AuthError.ERROR_TYPE;
    this.messageType = message;
  }
}
