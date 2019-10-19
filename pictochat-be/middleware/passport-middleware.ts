import passport from 'passport';
import passportLocal from 'passport-local';
import passportJwt, { ExtractJwt } from 'passport-jwt';
import { UserService } from '../services/user-service';
import config from '../utils/config';
import { transaction } from '../utils/transaction';

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

/**
 * Creates a passport strategy for registration
 */
const registerStrategy = new passportLocal.Strategy(
  {
    usernameField: 'username',
    passwordField: 'password',
    session: false
  },
  async (username, password, done) => {
    try {
      await transaction(async () => {
        // if user already exists, return false
        let user = await UserService.getUserByUsername(username);
        if (user !== null) {
          done(null, false, { message: 'Username is already being used' });
          return;
        }

        // else create the user
        user = await UserService.createUser(username, password);
        done(null, user);
      });
    } catch (e) {
      return done(e);
    }
  }
);

/**
 * Creates a passport strategy for login
 */
const loginStrategy = new passportLocal.Strategy(
  {
    usernameField: 'username',
    passwordField: 'password',
    session: false
  },
  async (username, password, done) => {
    try {
      // check if correct username
      const user = await UserService.getUserByUsername(username, true);
      if (user === null) return done(null, false, { message: 'incorrect username' });

      if (user.isDisabled) {
        return done(null, false, { message: 'This account has been disabled due to suspicious activity' });
      }

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

const jwtStrategy = new passportJwt.Strategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
    secretOrKey: config.JWT_SECRET
  },
  async (jwtPayload, done) => {
    try {
      const userId = jwtPayload.id;
      done(null, { userId });
      // NOTE: Checking if the token is valid (using the cryptographic key it was signed with)
      //        is handled internly by the JWT Strategy - Jordan
      // return done(null, false, { message: 'Invalid token' });
    } catch (e) {
      done(e);
    }
  }
);
