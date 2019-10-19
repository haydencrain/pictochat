import express from 'express';
import { userRouter } from './users-route';
import { reactionRouter } from './reaction-route';
import { discussionRouter } from './discussion-route';
import { imageRouter } from './image-route';
import { postRouter } from './post-route';
import { leaderboardRankRouter } from './leaderboard-rank-route';
import { sockPuppetAlertRouter } from './sock-puppet-alert-route';
import { contentReportRouter } from './content-report-router';

/** Route endpoints in use */
export const apiRouter = express.Router();
apiRouter.use('/user', userRouter);
apiRouter.use('/reaction', reactionRouter);
apiRouter.use('/discussion', discussionRouter);
apiRouter.use('/image', imageRouter);
apiRouter.use('/post', postRouter);
apiRouter.use('/leaderboard-rank', leaderboardRankRouter);
apiRouter.use('/sock-puppet-alert', sockPuppetAlertRouter);
apiRouter.use('/content-report', contentReportRouter);
