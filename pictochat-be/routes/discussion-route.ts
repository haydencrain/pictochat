import express from 'express';
import { DiscussionService } from '../services/discussion-service';

export const discussionRouter = express.Router();

discussionRouter.get('/', async (req, res, next) => {
  try {
    let threadSummaries = await DiscussionService.getThreadSummaries();
    let threadSummariesFlat = threadSummaries.map((threadSummary) => threadSummary.toFlatJSON());
    res.json(threadSummariesFlat);
  } catch (error) {
    next(error);
  }
});
