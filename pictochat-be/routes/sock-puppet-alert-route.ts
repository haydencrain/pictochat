import express from 'express';
import passport from 'passport';
import { strategies } from '../middleware/passport-middleware';
import { SockPuppetAlertRepo } from '../repositories/sock-puppet-alert-repo';
import { SockPuppetAlert } from '../models/sock-puppet-alert';
import { requireAdminMiddleware } from '../middleware/require-admin-middleware';

export const sockPuppetAlertRouter = express.Router();
/**
 * Implements HTTP responses for the endpoint `'/sock-puppet-alert'`
 */
sockPuppetAlertRouter.get(
  '/',
  passport.authenticate(strategies.JWT, { session: false }),
  requireAdminMiddleware,
  async (req: any, res, next) => {
    try {
      const alerts: SockPuppetAlert[] = await SockPuppetAlertRepo.getSockPuppetAlerts(req.query.userLimit);
      const alertsJson = alerts.map(alert => alert.toJSON());
      res.send(alertsJson);
    } catch (error) {
      next(error);
    }
  }
);
