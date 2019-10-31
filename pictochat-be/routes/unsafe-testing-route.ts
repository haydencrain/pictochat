import express from 'express';
import { loadTestData } from '../utils/load-test-data';

export const unsafeTestingRouter = express.Router();

// Resets backend state. Used by e2e tests to clear changes made in each test.
unsafeTestingRouter.post('/reset', async (req, res, next) => {
  try {
    await loadTestData();
    res.end();
  } catch (error) {
    next(error);
  }
});

