import express from 'express';
import { DiscussionService } from '../services/discussion-service';
import { PaginationOptions } from '../utils/pagination-types';

/**
 * Implements HTTP responses for the endpoint `'/api/discussion'`
 */
export const discussionRouter = express.Router();

/**
 * GET a list of summaries about discussions/threads
 *
 * @queryParam sort The sorting strategy to use. Must be a value defined in SortTypes (used for pagination)
 * @queryParam limit Maximum number of discussion threads to include (used for pagination)
 * @queryParam start The lowest page entry index (based on sort order) to include in the response (used for pagination)
 */
discussionRouter.get('/', async (req, res, next) => {
  try {
    const { sort, limit, start } = req.query;
    let threadSummaries = await DiscussionService.getPaginatedSummaries(sort, new PaginationOptions(start, limit));
    threadSummaries.results = DiscussionService.flattenDiscussions(threadSummaries.results);
    res.json(threadSummaries);
  } catch (error) {
    next(error);
  }
});
