import express from 'express';
import { LeaderboardRank } from '../models/leaderboard-rank';
import { LeaderboardService } from '../services/leaderboard-service';

// CONSTANTS
const MAX_RESULT_SIZE = 100;

export const leaderboardRankRouter = express.Router();

leaderboardRankRouter.get('/', async (req, res, next) => {
    try {
      let topN: number = Math.max(req.query.top || MAX_RESULT_SIZE, MAX_RESULT_SIZE);
      let ranks: LeaderboardRank[] = await LeaderboardService.getTopNLeaderBoardRanks(topN);
      let ranksJson: any[] = ranks.map(rank => rank.toJSON());
      res.json(ranksJson);
    } catch (error) {
      next(error);
    }
  }
);
