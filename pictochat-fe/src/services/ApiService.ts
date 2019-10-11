import { stringify } from 'query-string';
import ApiException from '../models/exceptions/ApiException';
import { DEVICE_ID_COOKIE_NAME } from '../utils/DeviceId';
import * as cookies from 'js-cookie';

const BACKEND_ENDPOINT = process.env.PICTOCHAT_API_ROOT || 'http://localhost:443/api';

export class ApiService {
  static async get(path: string, query: any = null): Promise<any> {
    const queryString = stringify(query);
    const safeQueryString = queryString ? `?${queryString}` : '';
    return ApiService.ajax('get', `${path}${safeQueryString}`);
  }

  static async post(path: string, data: any, contentType: string = 'application/json'): Promise<any> {
    return ApiService.ajax('post', path, data, contentType);
  }

  static async put(path: string, data: any, query: any = null, contentType: string = 'application/json'): Promise<any> {
    if (!query) return ApiService.ajax('put', path, data, contentType);
    const queryString = stringify(query);
    return ApiService.ajax('put', `${path}?${queryString}`, data, contentType);
  }

  static async patch(path: string, data: any, contentType: string = 'application/json'): Promise<any> {
    // NOTE: Case of method name matters for PATCH but not others (no idea why) - Jordan
    return ApiService.ajax('PATCH', path, data, contentType);
  }

  // naming inconsistency is due to delete being a reserved JS word
  static async sendDelete(path: string, data?: any): Promise<any> {
    return ApiService.ajax('delete', path, data, null);
  }

  /**
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
   */
  private static maybeEncodeData(data: any, contentType: string): any {
    if (contentType === 'application/json') {
      return JSON.stringify(data);
    }
    return data;
  }
}

export default ApiService;
