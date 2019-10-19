/**
 * Checks for any errors when running a sequelize instance
 * @param error
 * @param type
 */
export function isInstance(error: any, type: any): boolean {
  return error.errorType && error.errorType === type.ERROR_TYPE;
}
