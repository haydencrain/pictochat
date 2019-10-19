import { LeaderboardRank } from '../models/leaderboard-rank';
import { LeaderboardRankRepo } from '../repositories/leaderboard-rank-repo';

/** Gets the user ranking for the leaderboard */
export class LeaderboardService {
  /**
   * Returns the `topN` number of users with the highest scores (decrementing)
   * @param topN
   */
  static async getTopNLeaderBoardRanks(topN: number): Promise<LeaderboardRank[]> {
    return await LeaderboardRankRepo.getTop(topN);
  }
}
