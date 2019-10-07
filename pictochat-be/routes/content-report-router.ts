import express from 'express';
import passport from 'passport';
import { strategies } from '../middleware/passport-middleware';
import { ContentReportService } from '../services/content-report-service';
import { UserService } from '../services/user-service';
import { User } from '../models/user';
import { ContentReport } from '../models/content-report';
import { ForbiddenError } from '../exceptions/forbidden-error';

export const contentReportRouter = express.Router();

contentReportRouter.get(
  '/',
  passport.authenticate(strategies.JWT, { session: false }),
  async (req: any, res: any, next) => {
    try {
      // Only admins can view content reports
      const requestingUser: User = await UserService.getUser(req.user.userId);
      if (!requestingUser.hasAdminRole) {
        throw new ForbiddenError();
      }

      const reports: any[] = await ContentReportService.getContentReports();
      const reportsJson: any[] = reports.map(report => report.toJSON());
      res.json(reportsJson);
    } catch (error) {
      next(error);
    }
  }
);
