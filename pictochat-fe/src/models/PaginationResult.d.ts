export default interface PaginationResult<T> {
    /**
     * The start index of the pagination result
     */
    start: number;
    /**
     * The number of results the result has returned
     */
    size: number;
    /**
     * The collection of results
     */
    results: T[];
    /**
     * If there's still more data in the back-end to load, this will be set to `true`
     */
    hasNextPage: boolean;
    /**
     * The next starting index where to start fetching more results from
     */
    nextStart: number;
}
