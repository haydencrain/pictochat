import express from 'express';
import { userRouter } from './user-route';
import { testRouter } from './test-route';

export const apiRouter = express.Router();
apiRouter.use('/user', userRouter);
apiRouter.use('/test', testRouter);
