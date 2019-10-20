import { stringify } from 'query-string';
import ApiException from '../models/exceptions/ApiException';
import cookies from 'js-cookie';
import config from '../config';
import { DEVICE_ID_COOKIE_NAME } from '../utils/DeviceId';

const { BACKEND_ENDPOINT } = config.urls;

/**
 * A small HTTP client that allows fetching of requests with most methods
 * @class
 * @static
 * @author This code was created by both Hayden Crain and coworkers at his workplace, and has been used with their permission
 */
export class ApiService {
  /**
   * Performs a HTTP GET request
   * @param path The path to make the request to
   * @param query Any query data to be sent, (can be an `Object`, as data will be stringified)
   */
  static async get(path: string, query: any = null): Promise<any> {
    const queryString = stringify(query);
    const safeQueryString = queryString ? `?${queryString}` : '';
    return ApiService.ajax('GET', `${path}${safeQueryString}`);
  }

  /**
   * Performs a HTTP POST request
   * @param path The path to make the request to
   * @param data Any data to be sent, (can be an `Object`, as data will be stringified)
   * @param contentType defaults to `'application/json/'`
   */
  static async post(path: string, data: any, contentType: string = 'application/json'): Promise<any> {
    return ApiService.ajax('POST', path, data, contentType);
  }

  /**
   * Performs a HTTP PUT request
   * @param path The path to make the request to
   * @param data Any data to be sent, (can be an `Object`, as data will be stringified)
   * @param query Any query data to be sent, (can be an `Object`, as data will be stringified)   *
   * @param contentType defaults to `'application/json/'`
   */
  static async put(path: string, data: any, query: any = null, contentType: string = 'application/json'): Promise<any> {
    if (!query) return ApiService.ajax('put', path, data, contentType);
    const queryString = stringify(query);
    return ApiService.ajax('PUT', `${path}?${queryString}`, data, contentType);
  }

  /**
   * Performs a HTTP PATCH request
   * @param path The path to make the request to
   * @param data Any data to be sent, (can be an `Object`, as data will be stringified)
   * @param contentType defaults to `'application/json/'`
   */
  static async patch(path: string, data: any, contentType: string = 'application/json'): Promise<any> {
    // NOTE: Case of method name matters for PATCH but not others (no idea why) - Jordan
    return ApiService.ajax('PATCH', path, data, contentType);
  }

  /**
   * Performs a HTTP PATCH request
   * (NOTE: naming inconsistency is due to delete being a reserved JS word)
   * @param path The path to make the request to
   * @param data Any data to be sent, (can be an `Object`, as data will be stringified)
   */
  static async sendDelete(path: string, data?: any): Promise<any> {
    return ApiService.ajax('DELETE', path, data, null);
  }

  /**
   * Implements an 'ajax'y HTTP request, using the `fetch` API
   * @param method HTTP method to send
   * @param path URL path under the root of the backend API to send the request to
   * @param data Body of the request
   * @param accessToken
   * @param contentType value of the Content-Type header field. When null allows the browser to
   *    set Content-Type automatically (required when sending multi-part forms).
   */
  private static async ajax(
    method: string,
    path: string,
    data: any = null,
    contentType: string = 'application/json'
  ): Promise<any> {
    const headers: any = { accept: 'application/json' };
    if (contentType !== null) headers['Content-Type'] = contentType;

    const accessToken = cookies.get('pictochatJWT');
    if (!!accessToken) headers['Authorization'] = `JWT ${accessToken}`;

    // FIXME: Send a HttpOnly cookie from server on login instead of using fingerprint and headers
    const deviceId = cookies.get(DEVICE_ID_COOKIE_NAME);
    if (!!deviceId) headers['X-Device-Id'] = deviceId;

    const request: RequestInit = {
      headers,
      method,
      mode: 'cors'
    };

    if (data) request.body = ApiService.maybeEncodeData(data, contentType);

    return new Promise<any>((resolve, reject) => {
      fetch(BACKEND_ENDPOINT + path, request)
        .then(async response => {
          let responseBody: any = await response.text();
          try {
            responseBody = JSON.parse(responseBody);
          } catch {}
          if (response.ok) {
            resolve(responseBody);
          } else {
            let error = new ApiException(response.status, response.statusText, responseBody);
            reject(error);
          }
        })
        .catch(e => {
          // This leaves the promise unresolved, which is not a memory leak issue.
          // https://stackoverflow.com/questions/20068467/does-never-resolved-promise-cause-memory-leak
          // This solution is also why we need a .then() instead of await.
          if (e.name === 'AbortError') return;
          reject(e);
        });
    });
  }

  /**
   * Encodes data based on the specified contentType if known, otherwise returns data unaltered
   * @param data the data to encode
   * @param contentType data will be encoded if contentType is of type `'application/json'`
   */
  private static maybeEncodeData(data: any, contentType: string): any {
    if (contentType === 'application/json') {
      return JSON.stringify(data);
    }
    return data;
  }
}

export default ApiService;
