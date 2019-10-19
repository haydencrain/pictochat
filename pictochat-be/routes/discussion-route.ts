import express from 'express';
import { DiscussionService } from '../services/discussion-service';
import { PaginationOptions } from '../utils/pagination-types';

export const discussionRouter = express.Router();
/**
 * Implements HTTP responses for the endpoint `'/discussion'`
 */
discussionRouter.get('/', async (req, res, next) => {
  try {
    const { sort, limit, start } = req.query;
    /**
     * Displays `limit` number of posts
     */
    let threadSummaries = await DiscussionService.getPaginatedSummaries(sort, new PaginationOptions(start, limit));
    threadSummaries.results = DiscussionService.flattenDiscussions(threadSummaries.results);
    res.json(threadSummaries);
  } catch (error) {
    next(error);
  }
});
