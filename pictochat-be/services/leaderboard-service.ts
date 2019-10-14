import { LeaderboardRank } from '../models/leaderboard-rank';
import { LeaderboardRankRepo } from '../repositories/leaderboard-rank-repo';

export class LeaderboardService {
  static async getTopNLeaderBoardRanks(topN: number): Promise<LeaderboardRank[]> {
    return await LeaderboardRankRepo.getTop(topN);
  }
}
