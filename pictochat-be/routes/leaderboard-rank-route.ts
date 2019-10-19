import express from 'express';
import { LeaderboardRank } from '../models/leaderboard-rank';
import { LeaderboardService } from '../services/leaderboard-service';

// CONSTANTS
const MAX_RESULT_SIZE = 100;

export const leaderboardRankRouter = express.Router();
/**
 * Implements HTTP responses for the endpoint `'/leaderboard-rank'`
 */
leaderboardRankRouter.get('/', async (req, res, next) => {
  try {
    /** Returns a specified number of users with the highest scores */
    let topN: number = Math.max(req.query.top || MAX_RESULT_SIZE, MAX_RESULT_SIZE);
    let ranks: LeaderboardRank[] = await LeaderboardService.getTopNLeaderBoardRanks(topN);
    let ranksJson: any[] = ranks.map(rank => rank.toJSON());
    res.json(ranksJson);
  } catch (error) {
    next(error);
  }
});
