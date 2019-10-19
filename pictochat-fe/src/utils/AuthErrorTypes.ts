export const AUTH_ERROR = 'AUTH_ERROR';

export enum AuthErrorTypes {
  INCORRECT_CREDENTIALS,
  DUPLICATE_USERNAME,
  USER_DISABLED
}

const authErrorMessages = {
  0: 'Incorrect Credentials.',
  1: 'Username Already Exists.',
  2: 'This account has been disabled due to suspicious activity'
};

export function getAuthErrorMessage(messageType: AuthErrorTypes) {
  const errorMessage = authErrorMessages[messageType];
  if (!!errorMessage) return errorMessage;
  return 'Authentication Error';
}
