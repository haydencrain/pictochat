/**
 * Creates a new Key Exception
 * @class
 */
export default class KeyException {
    static readonly ERROR_TYPE = "KEY_ERROR";
    /**
     * Error Type, defaults to KEY_ERROR
     */
    errorType: string;
    /**
     * The message of the exception
     */
    message: string;
    constructor(message?: string);
}
