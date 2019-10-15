import express from 'express';
import passport from 'passport';
import { strategies } from '../middleware/passport-middleware';
import { User } from '../models/user';
import { ForbiddenError } from '../exceptions/forbidden-error';
import { SockPuppetAlert } from '../models/sock-puppet-alert';

export const sockPuppetAlertRouter = express.Router();
/**
 * Implements HTTP responses for the endpoint `'/sock-puppet-alert'`
 */
sockPuppetAlertRouter.get(
  '/',
  passport.authenticate(strategies.JWT, { session: false }),
  async (req: any, res, next) => {
    try {
      const userId = req.user.userId;
      const requestingUser = await User.findOne({ where: { userId } });

      if (!requestingUser.hasAdminRole) {
        throw new ForbiddenError();
      }
      /** Checks the userlimit as to how many accounts can be created by a single ip address */
      const alerts = await SockPuppetAlert.getSockPuppetAlerts(req.query.userLimit);
      const alertsJson = alerts.map(alert => alert.toJSON());
      console.log('alertsJson: ', JSON.stringify(alertsJson));

      res.send(alertsJson);
    } catch (error) {
      next(error);
    }
  }
);
