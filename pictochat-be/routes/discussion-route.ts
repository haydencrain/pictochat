import express from 'express';
import { DiscussionService } from '../services/discussion-service';

export const discussionRouter = express.Router();

discussionRouter.get('/', async (req, res, next) => {
  try {
    const { sort, limit, start } = req.query;
    let threadSummaries = await DiscussionService.getPaginatedSummaries(sort, { limit, start });
    threadSummaries.results = DiscussionService.flattenDiscussions(threadSummaries.results);
    res.json(threadSummaries);
  } catch (error) {
    next(error);
  }
});
