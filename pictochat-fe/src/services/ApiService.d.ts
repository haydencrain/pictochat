/**
 * A small HTTP client that allows fetching of requests with most methods
 * @class
 * @static
 * @author This code was created by both Hayden Crain and coworkers at his workplace, and has been used with their permission
 */
export declare class ApiService {
    /**
     * Performs a HTTP GET request
     * @param path The path to make the request to
     * @param query Any query data to be sent, (can be an `Object`, as data will be stringified)
     */
    static get(path: string, query?: any): Promise<any>;
    /**
     * Performs a HTTP POST request
     * @param path The path to make the request to
     * @param data Any data to be sent, (can be an `Object`, as data will be stringified)
     * @param contentType defaults to `'application/json/'`
     */
    static post(path: string, data: any, contentType?: string): Promise<any>;
    /**
     * Performs a HTTP PUT request
     * @param path The path to make the request to
     * @param data Any data to be sent, (can be an `Object`, as data will be stringified)
     * @param query Any query data to be sent, (can be an `Object`, as data will be stringified)   *
     * @param contentType defaults to `'application/json/'`
     */
    static put(path: string, data: any, query?: any, contentType?: string): Promise<any>;
    /**
     * Performs a HTTP PATCH request
     * @param path The path to make the request to
     * @param data Any data to be sent, (can be an `Object`, as data will be stringified)
     * @param contentType defaults to `'application/json/'`
     */
    static patch(path: string, data: any, contentType?: string): Promise<any>;
    /**
     * Performs a HTTP PATCH request
     * (NOTE: naming inconsistency is due to delete being a reserved JS word)
     * @param path The path to make the request to
     * @param data Any data to be sent, (can be an `Object`, as data will be stringified)
     */
    static sendDelete(path: string, data?: any): Promise<any>;
    /**
     * Implements an 'ajax'y HTTP request, using the `fetch` API
     * @param method HTTP method to send
     * @param path URL path under the root of the backend API to send the request to
     * @param data Body of the request
     * @param accessToken
     * @param contentType value of the Content-Type header field. When null allows the browser to
     *    set Content-Type automatically (required when sending multi-part forms).
     */
    private static ajax;
    /**
     * Encodes data based on the specified contentType if known, otherwise returns data unaltered
     * @param data the data to encode
     * @param contentType data will be encoded if contentType is of type `'application/json'`
     */
    private static maybeEncodeData;
}
export default ApiService;
