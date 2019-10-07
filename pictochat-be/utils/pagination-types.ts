import { isNullOrUndefined } from 'util';

export interface IPaginationOptions {
  start: number | null;
  limit: number | null;
}

export class PaginationOptions {
  start: number;
  limit: number;

  constructor(start: any, limit: any) {
    this.start = isNullOrUndefined(start) ? 0 : parseInt(start);
    this.limit = isNullOrUndefined(limit) ? null : parseInt(limit);
  }
}
