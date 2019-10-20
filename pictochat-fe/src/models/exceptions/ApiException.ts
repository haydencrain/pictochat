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

  constructor(status: number, statusText: string, body: any) {
    let message = body.message || JSON.stringify(body);
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.status = status;
    this.statusText = statusText;
    this.body = body;
  }
}
