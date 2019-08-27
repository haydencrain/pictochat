import express from 'express';
import { userRouter } from './user-route';
import { discussionPostRouter } from './discussion-route';

export const apiRouter = express.Router();
apiRouter.use('/user', userRouter);
apiRouter.use('/discussions', discussionPostRouter);
