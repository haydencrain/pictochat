import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import config from '../utils/config';
import { UserService } from '../services/user-service';
import { strategies } from '../middleware/passport-middleware';
import { deviceIdMiddleware } from '../middleware/device-id-middleware';
import { User } from '../models/user';
import { LoginLog } from '../models/login-log';

//// HELPERS ////

function makeJWTPayload(user: User): { auth: boolean; token: string } {
  const token = jwt.sign({ id: user.userId }, config.JWT_SECRET, {
    expiresIn: '24h'
  });
  return { auth: true, token };
}

//// ROUTER ////

export const userRouter = express.Router();

// GET /user
userRouter.get('/', async (req, res, next) => {
  try {
    if (req.params.username) {
      // get user by username
      const user = await UserService.getUserByUsername(req.query.username);
      return res.json(user.toJSON());
    } else {
      // get all users
      let users = await UserService.getUsers();
      return res.json(users);
    }
  } catch (error) {
    next(error);
  }
});

// GET current user ONLY IF AUTHED
userRouter.get('/authed', passport.authenticate(strategies.JWT, { session: false }), (req, res, next) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    next(error);
  }
});

// POST create user
userRouter.post('/', async (req: any, res, next) => {
  passport.authenticate(strategies.REGISTER, (err, user: boolean | User, info) => {
    if (err) return next(err);
    if (!user && !!info) {
      return res.status(400).json(info);
    }
    if (!!info) return res.json(info);
    try {
      req.logIn(user, async err => {
        let typedUser = user as User;
        await UserService.updateUser(typedUser.userId, { email: req.body.email });
        let body = makeJWTPayload(typedUser);
        body['message'] = 'User created successfully';
        body['user'] = typedUser.getPublicJSON();
        res.status(200).json(body);
      });
    } catch (error) {
      next(error);
    }
  })(req, res, next);
});

// POST auth user
userRouter.post('/login',
  deviceIdMiddleware,
  (req: any, res, next) => {
    passport.authenticate(strategies.LOGIN, (err, user, info) => {
      if (err) return next(err);
      if (!!info) return res.json(info);
      try {
        req.logIn(user, async err => {
          let body = makeJWTPayload(user as User);
          body['message'] = 'User logged in successfully';
          res.status(200).json(body);

          // TODO: Move this into dedicated service
          const loginLogRecord = {
            userId: user.userId,
            loginTimestamp: new Date(),
            deviceId: req.deviceId
          };
          console.log('loginLogRecord: ', loginLogRecord);
          await LoginLog.create(loginLogRecord);
        });
      } catch (error) {
        next(error);
      }
    })(req, res, next);
  }
);
