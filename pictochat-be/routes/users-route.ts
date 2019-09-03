import express from 'express';
import { UserService } from '../services/user-service';
export const userRouter = express.Router();

// GET /user
userRouter.get('/', async (req, res, next) => {
  try {
    console.log("get");
    let user = await UserService.getUsers();
    res.json(user.toJSON());
  } catch (error) {
    next(error);
  }
});


// GET /user/:userId
userRouter.get('/:userId', async (req, res, next) => {
  try {
    console.log("get");
    let user = await UserService.getUser(req.params.userId);
    res.json(user.toJSON());
  } catch (error) {
    next(error);
  }
});

// POST create user



// POST auth user
userRouter.post('/user/auth', async (req, res, next) => {
  try {
    const { body } = req;

    // use passport, check username n password

    // if success
    // generate token and send

    // if fail
    //resturn token

    res.json(body);

    // res.locals.connection.query('INSERT INTO USERS (userEmail, password) VALUES ('' + req.body.userEmail + '','' + req.password+'')');
  } catch (error) {
    next(error);
  }
);
