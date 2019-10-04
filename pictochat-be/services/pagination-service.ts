import { isNullOrUndefined } from 'util';

export interface PaginatedResults<T> {
  start: number;
  size: number;
  results: T[];
  hasNextPage: boolean;
  nextStart: number;
}

export class PaginationService {
  static getPaginatedResults<T>(collection: T[], limit: number, start?: number): PaginatedResults<T> {
    // Null or undefined start should become 0
    const startIndex = start || 0;
    // If limit is null or undefined, then just return the entire collection
    const end = isNullOrUndefined(limit) ? collection.length : startIndex + limit;
    const hasNextPage = end < collection.length;
    const results = collection.slice(start, end);
    const nextStart = hasNextPage ? end : null;
    const size = results.length;
    return {
      start: startIndex,
      size,
      results,
      hasNextPage,
      nextStart
    };
  }
}
