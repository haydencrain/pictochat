import { isNullOrUndefined } from 'util';
import { PaginationOptions } from '../utils/pagination-types';

export interface PaginatedResults<T> {
  start: number;
  size: number;
  results: T[];
  hasNextPage: boolean;
  nextStart: number;
}

export class PaginationService {
  static getPaginatedResults<T>(collection: T[], paginationOptions: PaginationOptions): PaginatedResults<T> {
    const end = isNullOrUndefined(paginationOptions.limit)
      ? collection.length
      : paginationOptions.start + paginationOptions.limit;
    const hasNextPage = end < collection.length;
    const results = collection.slice(paginationOptions.start, end);
    const nextStart = hasNextPage ? end : null;
    const size = results.length;
    return {
      start: paginationOptions.start,
      size,
      results,
      hasNextPage,
      nextStart
    };
  }
}
