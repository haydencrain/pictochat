import express from 'express';
import passport from 'passport';
import { strategies } from '../middleware/passport-middleware';
import { ContentReportService } from '../services/content-report-service';
import { UserService } from '../services/user-service';
import { User } from '../models/user';
import { ForbiddenError } from '../exceptions/forbidden-error';
import { requireAdminMiddleware } from '../middleware/require-admin-middleware';

export const contentReportRouter = express.Router();

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
