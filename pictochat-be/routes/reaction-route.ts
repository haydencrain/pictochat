import express from 'express';
import config from '../utils/config';
import { ReactionService } from '../services/reaction-service';
import { Reaction } from '../models/reaction';
import { userRouter } from './users-route';

export const reactionRouter = express.Router();

//GET reaction
reactionRouter.get('/', async (req, res, next) => {
  try {
    if (req.query.postId) {
      const reactionPost = await ReactionService.getReactionsByPost(req.query.postId);
      return res.json(reactionPost);
    } else if (req.query.userId) {
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
    let createReaction = await ReactionService.createReaction(req.body.reactionName, req.body.postId, req.body.userId);
    return res.json(createReaction);
  } catch (error) {
    next(error);
  }
});

//DELETE reaction
reactionRouter.delete('/', async (req: any, res, next) => {
  try {
    let removeReaction = await ReactionService.removeReaction(req.body.reactionName, req.body.postId, req.body.userId);
    return res.json(removeReaction);
  } catch (error) {
    next(error);
  }
});
