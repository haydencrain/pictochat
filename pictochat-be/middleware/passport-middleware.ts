import passport from 'passport';
import passportLocal from 'passport-local';
import passportJwt, { ExtractJwt } from 'passport-jwt';
import { UserService } from '../services/user-service';
import config from '../utils/config';
import { transaction } from '../utils/transaction';
import { AuthError, AuthErrorMessageTypes } from '../exceptions/auth-error';
import { User } from '../models/user';

/**
 * NOTE: Much of the code in this module is adapted from:
 *    Niedringhaus, P. 2018, 'Implementing JSON Web Tokens & Passport.js in a JavaScript Application with React',
 *        viewed 19 Oct 2019, <https://itnext.io/implementing-json-web-tokens-passport-js-in-a-javascript-application-with-react-b86b1f313436>.
 */

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
        if (user !== null) throw new AuthError(AuthErrorMessageTypes.DUPLICATE_USERNAME);

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

      if (user === null) throw new AuthError(AuthErrorMessageTypes.INCORRECT_CREDENTIALS);
      if (user.isDisabled) throw new AuthError(AuthErrorMessageTypes.USER_DISABLED);

      await assertPasswordMatch(user, password);

      // check if correct password
      const isCorrectPassword = await UserService.assertPasswordMatch(user, password);
      if (!isCorrectPassword) throw new AuthError(AuthErrorMessageTypes.INCORRECT_CREDENTIALS);

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

/**
 * Checks to see if the password matches the user's password, and throws an `AuthError` if false
 * @function
 * @param user
 * @param password
 */
async function assertPasswordMatch(user: User, password: string) {
  const isCorrectPassword = await UserService.assertPasswordMatch(user, password);
  if (!isCorrectPassword) throw new AuthError(AuthErrorMessageTypes.INCORRECT_CREDENTIALS);
}
