import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import config from '../utils/config';
import { UserService } from '../services/user-service';
import { strategies } from '../middleware/passport-middleware';

export const userRouter = express.Router();

// GET /user
userRouter.get('/', async (req, res, next) => {
  try {
    if (req.params.username) {
      // get user by username
      const user = await UserService.getUserByUsername(req.params.username);
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
  passport.authenticate(strategies.REGISTER, (err, user, info) => {
    if (err) return next(err);
    if (!user && !!info) res.send(401).json(info);
    if (!!info) return res.json(info);
    try {
      req.logIn(user, async err => {
        await UserService.updateUser(user.userId, { email: req.body.email });
        res.status(200).json({ message: 'User created successfully' });
      });
    } catch (error) {
      next(error);
    }
  })(req, res, next);
});

// POST auth user
userRouter.post('/login', (req, res, next) => {
  passport.authenticate(strategies.LOGIN, (err, user, info) => {
    if (err) return next(err);
    if (!!info) return res.json(info);
    try {
      req.logIn(user, async err => {
        const token = jwt.sign({ id: user.userId }, config.JWT_SECRET, {
          expiresIn: '24h'
        });
        res.status(200).json({
          auth: true,
          message: 'User logged in successfully',
          token
        });
      });
    } catch (error) {
      next(error);
    }
  })(req, res, next);
});
