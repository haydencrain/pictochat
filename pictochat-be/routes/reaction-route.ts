import express from 'express';
import config from '../utils/config';
import { ReactionService } from '../services/reaction-service';
import { Reaction } from '../models/reaction';
import { userRouter } from './users-route';

export const reactionRouter = express.Router();

//GET reaction
reactionRouter.get('/', async (req, res, next) => {
  try {
    if (req.params.postId) {
      const reactionPost = await ReactionService.getReactionsByPost(req.query.postId);
      return res.json(reactionPost);
    } else if (req.params.userId) {
      let reactionUser = await ReactionService.getReactionsByUser(req.query.userId);
      return res.json(reactionUser);
    } else {
      let reaction = await ReactionService.getReactions(req.query.postId, req.query.userId);
      return res.json(reaction);
    }
  } catch (error) {
    next(error);
  }
});

//POST reaction
reactionRouter.post('/', async (req: any, res, next) => {
  try {
    let createReaction = await ReactionService.createReaction(
      req.query.reactionId,
      req.query.reactionName,
      req.query.postId,
      req.query.userId
    );
    return res.json(createReaction);
  } catch (error) {
    next(error);
  }
});

//DELETE reaction
reactionRouter.delete('/', async (req: any, res, next) => {
  try {
    let removeReaction = await ReactionService.removeReaction(req.query.reactionId);
    return res.json(removeReaction);
  } catch (error) {
    next(error);
  }
});
