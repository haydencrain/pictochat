import { LeaderboardRank } from '../models/leaderboard-rank';

export class LeaderboardService {
  static async getTopNLeaderBoardRanks(topN: number): Promise<LeaderboardRank[]> {
    return await LeaderboardRank.getTop(topN);
  }
}
