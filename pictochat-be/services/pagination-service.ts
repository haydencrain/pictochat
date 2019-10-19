import { isNullOrUndefined } from 'util';
import { PaginationOptions } from '../utils/pagination-types';
import { DiscussionPost } from '../models/discussion-post';

export interface PaginatedResults<T> {
  start: number;
  size: number;
  results: T[];
  hasNextPage: boolean;
  nextStart: number;
}

/** Returns posts and replies prior to pagination */
export class PaginationService {
  /**
   * Returns an array of posts prior to pagination
   * @param collection
   * @param paginationOptions
   */
  static getPaginatedResults<T>(collection: T[], paginationOptions: PaginationOptions): PaginatedResults<T> {
    // Checks if the number of posts is larger than the maximum number allowed
    const end = isNullOrUndefined(paginationOptions.limit)
      ? collection.length
      : paginationOptions.start + paginationOptions.limit;
    // Checks if there are enough posts to create an additional page
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

  /**
   * Returns replies to each post currently on the page
   * @param orderedPosts
   * @param startAfterPostId
   */
  static getFilteredReplies(orderedPosts: DiscussionPost[], startAfterPostId: number): DiscussionPost[] {
    for (let i = 0; i < orderedPosts.length; i++) {
      if (orderedPosts[i].postId === startAfterPostId) {
        return orderedPosts.slice(i + 1);
      }
    }
    return orderedPosts;
  }
}
