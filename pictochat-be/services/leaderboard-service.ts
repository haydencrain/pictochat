import { LeaderboardRank } from '../models/leaderboard-rank';

/** Gets the user ranking for the leaderboard */
export class LeaderboardService {
  /**
   * Returns the `topN` number of users with the highest scores (decrementing)
   * @param topN
   */
  static async getTopNLeaderBoardRanks(topN: number): Promise<LeaderboardRank[]> {
    return await LeaderboardRank.getTop(topN);
  }
}
