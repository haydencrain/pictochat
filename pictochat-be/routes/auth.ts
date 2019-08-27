import express from "express";
const router = express.Router();

import jwt from "javawebtoken";
import passport from "passport";

router.post("./login", function(req, res, next) {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        message: "Something is not right",
        user: user
      });
    }
    req.login(user, { session: false }, err => {
      if (err) {
        res.send(err);
      }

      const token = jwt.sign(user, "jwt_secret");
      return res.json({ user, token });
    });
  })(req, res);
});

module.exports = router;
