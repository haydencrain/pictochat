import { stringify } from 'query-string';
import ApiException from '../model/ApiException';

const BACKEND_ENDPOINT = 'http://localhost:443/api';

class ApiService {
  async get(path: string, query: any = null): Promise<any> {
    const queryString = stringify(query);
    const safeQueryString = queryString ? `?${queryString}` : '';
    return this.ajax('get', `${path}${safeQueryString}`, null);
  }

  async post(path: string, data: any): Promise<any> {
    return this.ajax('post', path, data);
  }

  async put(path: string, data: any, query: any = null): Promise<any> {
    if (!query) return this.ajax('put', path, data);
    const queryString = stringify(query);
    return this.ajax('put', `${path}?${queryString}`, data);
  }

  async patch(path: string, data: any): Promise<any> {
    return this.ajax('patch', path, data);
  }

  // naming inconsistency is due to delete being a reserved JS word
  async sendDelete(path: string): Promise<any> {
    return this.ajax('delete', path, null);
  }

  async ajax(method: string, path: string, data: any, accessToken: string = null) {
    const headers: any = {
      'Content-Type': 'application/json',
      accept: 'application/json'
    };
    if (accessToken !== null) headers['Authorization'] = `Bearer ${accessToken}`;

    const request: RequestInit = {
      headers,
      method,
      mode: 'cors'
    };
    if (data) request.body = JSON.stringify(data);

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
}

export default new ApiService();
