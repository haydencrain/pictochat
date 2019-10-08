import { User } from '../models/user';
import passport from 'passport';
import express from 'express';

export const registerUser = express.Router();

// FIXME: remove this file

registerUser.post('/registerUser', (req, res, next) => {
  passport.authenticate('register', (err, user, info) => {
    if (err) console.log(err);
  });
});
