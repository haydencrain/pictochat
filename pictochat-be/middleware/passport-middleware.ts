import passport from 'passport';
import passportLocal from 'passport-local';
import passportJwt, { ExtractJwt } from 'passport-jwt';
import { UserService } from '../services/user-service';
import config from '../utils/config';

export const strategies = {
  LOGIN: 'login',
  REGISTER: 'register',
  JWT: 'jwt'
};

// DEFAULT EXPORT
export function initialisePassport() {
  passport.use(strategies.LOGIN, loginStrategy);
  passport.use(strategies.REGISTER, registerStrategy);
  passport.use(strategies.JWT, jwtStrategy);
  return passport.initialize();
}

const registerStrategy = new passportLocal.Strategy(
  {
    usernameField: 'username',
    passwordField: 'password',
    session: false
  },
  async (username, password, done) => {
    try {
      // if user already exists, return false
      let user = await UserService.getUserByUsername(username);
      if (user !== null) return done(null, false, { message: 'Username is already being used' });
      // else create the user
      user = await UserService.createUser(username, password);
      return done(null, user);
    } catch (e) {
      return done(e);
    }
  }
);

const loginStrategy = new passportLocal.Strategy(
  {
    usernameField: 'username',
    passwordField: 'password',
    session: false
  },
  async (username, password, done) => {
    try {
      // check if correct username
      const user = await UserService.getUserByUsername(username);
      if (user === null) return done(null, false, { message: 'incorrect username' });

      // check if correct password
      const isCorrectPassword = await UserService.assertPasswordMatch(user, password);
      if (!isCorrectPassword) return done(null, false, { message: 'passwords do not match' });

      // user found
      return done(null, user);
    } catch (e) {
      done(e);
    }
  }
);

// NOTE: DO NOT RETURN done()!
const jwtStrategy = new passportJwt.Strategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
    secretOrKey: config.JWT_SECRET
  },
  async (jwtPayload, done) => {
    try {
      const userId = jwtPayload.id;
      const user = await UserService.getUser(userId);
      if (user !== null) return done(null, user);
      return done(null, false, { message: 'Invalid token' });
    } catch (e) {
      done(e);
    }
  }
);
