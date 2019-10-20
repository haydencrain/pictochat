import express from 'express';
import passport from 'passport';
import { strategies } from '../middleware/passport-middleware';
import { ReactionRepo } from '../repositories/reaction-repo';
import { ReactionService } from '../services/reaction-service';
import { UnprocessableError } from '../exceptions/unprocessable-error';

/**
 * Implements HTTP responses for the endpoint `'/api/reaction'`
 */
export const reactionRouter = express.Router();

/**
 * GET repsonses based on the postId, userId or discussionId
 * @queryParam postId
 * @queryParam discussionId
 * @queryParam userId
 */
reactionRouter.get('/', async (req, res, next) => {
  try {
    if (req.query.by === 'POST') {
      validateSearchParam(req, 'postId');
      const reactionPost = await ReactionService.getReactionsByPost(req.query.postId);
      return res.json(reactionPost);
    } else if (req.query.by === 'USER') {
      validateSearchParam(req, 'userId');
      const reactionUser = await ReactionService.getReactionsByUser(req.query.userId);
      return res.json(reactionUser);
    } else if (req.query.by === 'DISCUSSION') {
      validateSearchParam(req, 'discussionId');
      const reactions = await ReactionRepo.getReactionsByDiscussion(req.query.discussionId);
      const reactionsJson = reactions.map(react => react.toJSON());
      res.json(reactionsJson);
    } else {
      const reaction = await ReactionService.getReactions(req.query.postId, req.query.userId);
      return res.json(reaction);
    }
  } catch (error) {
    next(error);
  }

  function validateSearchParam(req, paramName) {
    if (!req.query[paramName]) {
      throw new UnprocessableError(`Missing ${paramName} query param`);
    }
  }
});

/**
 * POST
 * Create a reaction
 * @body JSON with format {reactionName, postId}
 */
reactionRouter.post('/', passport.authenticate(strategies.JWT, { session: false }), async (req: any, res, next) => {
  try {
    // NOTE: We use the userId associated with the client's session to set the reaction's user
    const createReaction = await ReactionService.createReaction(
      req.body.reactionName,
      req.body.postId,
      req.user.userId
    );
    return res.json(createReaction);
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE reaction
 * @urlParam reactionId
 */
reactionRouter.delete(
  '/:reactionId',
  passport.authenticate(strategies.JWT, { session: false }),
  async (req: any, res, next) => {
    try {
      await ReactionService.removeReaction(req.params.reactionId, req.user.userId);
      res.status(204);
      res.end();
    } catch (error) {
      next(error);
    }
  }
);
