import express from 'express';
import { DiscussionService } from '../services/discussion-service';
import { PaginationService } from '../services/pagination-service';

export const discussionRouter = express.Router();

discussionRouter.get('/', async (req, res, next) => {
  try {
    let threadSummaries = await DiscussionService.getThreadSummaries();
    let threadSummariesFlat = threadSummaries.map(threadSummary => threadSummary.toFlatJSON());
    let paginatedSummaries = PaginationService.getPaginatedResults(
      threadSummariesFlat,
      req.query.limit,
      req.query.start
    );
    res.json(paginatedSummaries);
  } catch (error) {
    next(error);
  }
});
