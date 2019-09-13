import express from 'express';
import { userRouter } from './users-route';
import { discussionRouter } from './discussion-route';
import { imageRouter } from './image-route';

export const apiRouter = express.Router();
apiRouter.use('/user', userRouter);
apiRouter.use('/discussion', discussionRouter);
apiRouter.use('/image', imageRouter);
