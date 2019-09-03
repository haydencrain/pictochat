import express from 'express';
import { userRouter } from './user-route';
import { discussionPostRouter } from './discussion-thread-route';
import { challengeRouter } from './challenge-route';

export const apiRouter = express.Router();
apiRouter.use('/user', userRouter);
apiRouter.use('/discussions', discussionPostRouter);
apiRouter.use('/challenge', challengeRouter);
