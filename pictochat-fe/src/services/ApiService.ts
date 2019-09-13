import { stringify } from 'query-string';
import ApiException from '../models/ApiException';
import * as cookies from 'js-cookie';

const BACKEND_ENDPOINT = process.env.PICTPICTOCHAT_DB_HOSTOCHAT_API_ROOT || 'http://localhost:443/api';

export class ApiService {
  static async get(path: string, query: any = null): Promise<any> {
    const queryString = stringify(query);
    const safeQueryString = queryString ? `?${queryString}` : '';
    return ApiService.ajax('get', `${path}${safeQueryString}`);
  }

  static async post(path: string, data: any, contentType: string = 'application/json'): Promise<any> {
    return ApiService.ajax('post', path, data, null, contentType);
  }

  static async put(path: string, data: any, query: any = null, contentType: string = 'application/json'): Promise<any> {
    if (!query) return ApiService.ajax('put', path, data, null, contentType);
    const queryString = stringify(query);
    return ApiService.ajax('put', `${path}?${queryString}`, data, null, contentType);
  }

  static async patch(path: string, data: any, contentType: string = 'application/json'): Promise<any> {
    return ApiService.ajax('patch', path, data, null, contentType);
  }

  // naming inconsistency is due to delete being a reserved JS word
  async sendDelete(path: string): Promise<any> {
    return ApiService.ajax('delete', path, null);
  }

  /**
   * @param method HTTP method to send
   * @param path URL path under the root of the backend API to send the request to
   * @param data Body of the request
   * @param accessToken
   * @param contentType value of the Content-Type header field. When null allows the browser to
   *    set Content-Type automatically (required when sending multi-part forms).
   */
  static async ajax(
    method: string,
    path: string,
    data: any = null,
    accessToken: string = cookies.get('pictochatJWT'),
    contentType: string = 'application/json'
  ): Promise<any> {
    const headers: any = { accept: 'application/json' };
    if (contentType !== null) headers['Content-Type'] = contentType;
    if (accessToken !== null) headers['Authorization'] = `JWT ${accessToken}`;

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
            reject({
              status: response.status,
              statusText: response.statusText,
              body: responseBody
            } as ApiException);
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
//export default new ApiService();
