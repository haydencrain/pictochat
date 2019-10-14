/**
 * Creates a new Api Exception
 * @class
 */
export default class ApiException extends Error {
    /**
     * Exception status number
     */
    status: number;
    /**
     * Exception status type
     */
    statusText: string;
    /**
     * Body content
     */
    body: any;
    constructor(status: number, statusText: string, body: any);
}
