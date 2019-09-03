import express from 'express';

export const challengeRouter = express.Router();

/* GET test. */
challengeRouter.get('/test', function(req, res, next) {
  res.status(200).json('respond with a resource');
});

// POST sales
challengeRouter.post('/', function(req, res, next) {
  try {
    const { sales } = req.body;
    const rate = 0.2;
    const commission = Number(sales) * rate;
    res.json({ commission });
  } catch (error) {
    next(error);
  }
});
