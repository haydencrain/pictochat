import express from 'express';
import { DiscussionService } from '../services/discussion-service';
import { ImageService } from '../services/image-service';
import { DiscussionTreeNode } from '../models/discussion-tree-node';

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

discussionRouter.get('/:discussionId', async (req, res, next) => {
  try {
    let replyTree: DiscussionTreeNode = await DiscussionService.getReplyTreeForThread(req.params.discussionId);
    res.json(replyTree.toJSON());
  } catch (error) {
    next(error);
  }
});
