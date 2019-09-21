
export function isInstance(error: any, type: any): boolean {
  return error.errorType && error.errorType === type.ERROR_TYPE;
}
