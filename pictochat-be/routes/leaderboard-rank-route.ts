import express from 'express';
import { LeaderboardRank } from '../models/leaderboard-rank';
import { LeaderboardService } from '../services/leaderboard-service';

// CONSTANTS
const MAX_RESULT_SIZE = 100;

/**
 * Implements HTTP responses for the endpoint `'/api/leaderboard-rank'`
 */
export const leaderboardRankRouter = express.Router();

/**
 * GET Get the specified number of top leaderboard ranks
 *
 * @queryParam top The number of leaderboard ranks to include in the response.
 */
leaderboardRankRouter.get('/', async (req, res, next) => {
  try {
    const topN: number = Math.max(parseInt(req.query.top) || MAX_RESULT_SIZE, MAX_RESULT_SIZE);
    const ranks: LeaderboardRank[] = await LeaderboardService.getTopNLeaderBoardRanks(topN);
    const ranksJson: any[] = ranks.map(rank => rank.toJSON());
    res.json(ranksJson);
  } catch (error) {
    next(error);
  }
});
