import express from 'express';
import { userRouter } from './user-route';

export const apiRouter = express.Router();
apiRouter.use('/user', userRouter);
