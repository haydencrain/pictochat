import express from 'express';
import { UserService } from '../services/user-service';
import passport from 'passport';
export const userRouter = express.Router();

// GET /user
userRouter.get('/', async (req, res, next) => {
  try {
    console.log('get');
    let users = await UserService.getUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

// GET /user/:userId
userRouter.get('/:userId', async (req, res, next) => {
  try {
    console.log('get');
    let user = await UserService.getUser(req.params.userId);
    res.json(user.toJSON());
  } catch (error) {
    next(error);
  }
});

// POST create user
userRouter.post('/', async (req: any, res, next) => {
  passport.authenticate('register', async (err, user, info) => {
    if (err) return next(err);
    if (!!info) return res.json(info);

    try {
      req.logIn(async (user, err) => {
        const loggedInUser = await UserService.getUser(user.username);
        await UserService.updateUser(loggedInUser.userId, {
          userEmail: req.body.email
        });
      });

      res.status(200).json({ message: 'User created successfully' });
    } catch (error) {
      next(error);
    }
  });
});

// POST auth user
// userRouter.post('/auth', async (req, res, next) => {
//   passport.authenticate('login', async (err, user, info) => {
//     if (err) return next(err);
//     if (!!info) return res.json(info);

//     try {
//       req.logIn(async (user, err) => {
//         const loggedInUser = await UserService.getUser(user.username);
//         await UserService.updateUser(loggedInUser.userId, {
//           userEmail: req.body.email
//         })
//       });

//       res.status(200).json({ message: 'User created successfully' });
//     } catch (error) {
//       next(error);
//     }
//   });
// );
