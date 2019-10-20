import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import config from '../utils/config';
import { UserService } from '../services/user-service';
import { strategies } from '../middleware/passport-middleware';
import { deviceIdMiddleware } from '../middleware/device-id-middleware';
import { User } from '../models/user';
import { validateUserAttrsMiddleware } from '../middleware/validate-user-attrs-middleware';
import { LoginLogRepo } from '../repositories/login-log-repo';

//// ROUTER ////

export const userRouter = express.Router();

/** GET users
 * @queryParam username (optional)
 */
userRouter.get('/', async (req, res, next) => {
  try {
    if (req.query.username) {
      // get user by username
      const user = await UserService.getUserByUsername(req.query.username);
      res.json(user.getPublicJSON());
    } else {
      // get all users
      let users = await UserService.getUsers();
      res.json(users.map(user => user.getPublicJSON()));
    }
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE
 * Disable a user
 * @urlParam userId
 */
userRouter.delete(
  '/:userId',
  passport.authenticate(strategies.JWT, { session: false }),
  async (req: any, res, next) => {
    try {
      await UserService.disableUser(req.params.userId, req.user.userId);
      res.status(204);
      res.end();
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST
 * Create user
 * @body JSON with format {username, password, email}
 * @response JSON with format {user, message}
 */
userRouter.post('/', validateUserAttrsMiddleware, deviceIdMiddleware, async (req: any, res, next) => {
  /*
   * NOTE: Much of the code in this function is adapted from:
   *    Niedringhaus, P. 2018, 'Implementing JSON Web Tokens & Passport.js in a JavaScript Application with React',
   *        viewed 19 Oct 2019, <https://itnext.io/implementing-json-web-tokens-passport-js-in-a-javascript-application-with-react-b86b1f313436>.
   */
  passport.authenticate(strategies.REGISTER, (err, user: boolean | User, info) => {
    if (err) return next(err);

    if (!user && !!info) {
      return res.status(400).json(info);
    }

    if (!!info) return res.json(info);

    try {
      req.logIn(user, async err => {
        const typedUser = user as User;
        await UserService.updateUser(typedUser.userId, { email: req.body.email });
        let body = makeJWTPayload(typedUser);
        body['message'] = 'User created successfully';
        body['user'] = typedUser.getPublicJSON();
        res.json(body);

        LoginLogRepo.logUserAccess(typedUser, req.deviceId);
      });
    } catch (error) {
      next(error);
    }
  })(req, res, next);
});

/**
 * GET the user associated with the clients current session (e.g. based on client's JWT)
 *
 * NOTE: Breaking of RESTful conventions is intentional and prevents user credentials
 *    from being included in URL.
 */
userRouter.get('/authed', passport.authenticate(strategies.JWT, { session: false }), async (req: any, res, next) => {
  try {
    const user: User = await UserService.getUser(req.user.userId);
    res.json(user.getPublicJSON());
  } catch (error) {
    next(error);
  }
});

/**
 * POST
 * This handler is used to login clients
 *
 * NOTE: Breaking of RESTful conventions is intentional and prevents user credentials
 *    from being included in URL.
 */
userRouter.post('/login', deviceIdMiddleware, (req: any, res, next) => {
  /*
   * NOTE: Much of the code in this function is adapted from:
   *    Niedringhaus, P. 2018, 'Implementing JSON Web Tokens & Passport.js in a JavaScript Application with React',
   *        viewed 19 Oct 2019, <https://itnext.io/implementing-json-web-tokens-passport-js-in-a-javascript-application-with-react-b86b1f313436>.
   */
  passport.authenticate(strategies.LOGIN, (err, user, info) => {
    if (err) return next(err);
    if (!!info) return res.json(info);
    try {
      req.logIn(user, async err => {
        let body = makeJWTPayload(user as User);
        body['message'] = 'User logged in successfully';
        res.json(body);

        LoginLogRepo.logUserAccess(user, req.deviceId);
      });
    } catch (error) {
      next(error);
    }
  })(req, res, next);
});

//// HELPERS ////

function makeJWTPayload(user: User): { auth: boolean; token: string } {
  const token = jwt.sign({ id: user.userId }, config.JWT_SECRET, {
    expiresIn: '24h'
  });
  return { auth: true, token };
}
