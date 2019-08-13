import express from 'express';

export const userRouter = express.Router();

/* GET users listing. */
userRouter.get('/', function (req, res, next) {
  res.send('respond with a resource');
});
