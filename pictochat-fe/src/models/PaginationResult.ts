export default interface PaginationResult<T> {
  start: number;
  size: number;
  results: T[];
  hasNextPage: boolean;
  nextStart: number;
}
