import { AUTH_ERROR, getAuthErrorMessage } from './AuthErrorTypes';

function getMessageToDisplay(error) {
  try {
    const body = JSON.parse(error.message);
    if (body.errorType === AUTH_ERROR) {
      return getAuthErrorMessage(body.messageType);
    } else if (!!body.message) {
      return body.message;
    }
  } catch (e) {
    // If JSON.parse errors, then it's a normal message string that we should return
    return error.message;
  }
}

export function handleError(error) {
  alert(getMessageToDisplay(error));
}
