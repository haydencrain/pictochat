import config from './config';
import bcrypt from 'bcrypt';
import { UserService } from '../services/user-service';

const passport = require('passport'),
  localStrategy = require('passport-local').Strategy,
  User = require('../services/sequelize-connection-service'),
  JWTStrategy = require('passport-jwt').Strategy,
  ExtractJWT = require('passport-jwt').ExtractJWT;

passport.use(
  'register',
  new localStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      session: false
    },
    async (username, password, done) => {
      try {
        const user = await UserService.getUser(username);
        if (user !== null) {
          console.log('username already in use');
          return done(null, false, { message: 'username already in use' });
        }
        await UserService.createUser(username, password);
      } catch (err) {
        done(err);
      }
    }
  )
);

passport.use(
  'login',
  new localStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      session: false
    },
    async (username, password, done) => {
      try {
        const user = await UserService.getUser(username);
        if (user == null) {
          return done(null, false, { message: 'incorrect username' });
        } else {
          const successs = await UserService.assertPasswordMatch(user, password);
          if (!successs) {
            return done(null, false, { message: 'passwords do not match' });
          }

          console.log('user found and authenticated');
          return done(null, user);
        }
      } catch (err) {
        done(err);
      }
    }
  )
);

const opts = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme('JWT'),
  secretOrKey: config.secret
};

passport.use(
  'jwt',
  new JWTStrategy(opts, (jwt_payload, done) => {
    try {
      User.findOne({
        where: {
          username: jwt_payload.id
        }
      }).then(user => {
        if (user) {
          console.log('user found in db via passport');
          done(null, user);
        } else {
          console.log('user not found in db');
          done(null, false);
        }
      });
    } catch (err) {
      done(err);
    }
  })
);

export default passport;
