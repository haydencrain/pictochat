import express from 'express';
import { userRouter } from './user-route';
import { discussionRouter } from './discussion-route';
import { imageRouter } from './image-route';
import { postRouter } from './post-route';

export const apiRouter = express.Router();
apiRouter.use('/user', userRouter);
apiRouter.use('/discussion', discussionRouter);
apiRouter.use('/image', imageRouter);
apiRouter.use('/post', postRouter);
