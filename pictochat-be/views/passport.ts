import passport from "passport";
import LocalStrat from "passport-local";
import passportJWT from "passport-jwt";

const LocalStrategy = LocalStrat.Strategy;
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password"
    },
    function(email, password, cb) {
      return UserModel.findOne({ email, password })
        .then(user => {
          if (!user) {
            return cb(null, false, { message: "Incorrect email or password" });
          }
          return cb(null, user, { message: "Logged in successfully" });
        })
        .catch(err => cn(err));
    }
  )
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: "jwt_secret"
    },
    function(jwtPayload, cb) {
      return UserModel.findOneById(jwtPayload.id)
        .then(user => {
          return cb(null, user);
        })
        .catch(err => {
          return cb(err);
        });
    }
  )
);
