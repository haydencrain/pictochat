import express from 'express';
import passport from 'passport';
import { strategies } from '../middleware/passport-middleware';
import { ContentReportService } from '../services/content-report-service';
import { requireAdminMiddleware } from '../middleware/require-admin-middleware';

export const contentReportRouter = express.Router();
/**
 * Implements HTTP responses for the endpoint `'/content-report'`
 */
contentReportRouter.get(
  '/',
  passport.authenticate(strategies.JWT, { session: false }),
  requireAdminMiddleware,
  async (req: any, res: any, next) => {
    try {
      const reportedPosts = await ContentReportService.getReportedPosts();
      const reportedPostsJson = reportedPosts.map(post => post.toJSON());
      res.json(reportedPostsJson);
    } catch (error) {
      next(error);
    }
  }
);
