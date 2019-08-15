import express from 'express';

export const testRouter = express.Router();
testRouter.get("/", function (req, res, next) {
    res.send("API is working properly");
});
