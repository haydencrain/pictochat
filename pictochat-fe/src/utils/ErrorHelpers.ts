import { AUTH_ERROR, getAuthErrorMessage } from './AuthErrorTypes';

function getMessageToDisplay(error) {
  const body = JSON.parse(error.message);
  if (body.errorType === AUTH_ERROR) {
    return getAuthErrorMessage(body.messageType);
  } else if (!!body.message) {
    return body.message;
  } else {
    return error.message;
  }
}

export function handleError(error) {
  alert(getMessageToDisplay(error));
}
