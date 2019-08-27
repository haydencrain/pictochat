import express from "express";
const router = express.Router();

router.get("/", function(req, res, next) {
  res.send("resond with a resource");
});

router.get("/profile", function(req, res, next) {
  res.send(req.user);
});

module.exports = router;
