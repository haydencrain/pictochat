import ApiService from './ApiService';
import { ILeaderboardRank } from '../models/store/LeaderboardRank';

export class LeaderboardService {
  static async getLeaderboardRanks(top: number): Promise<ILeaderboardRank[]> {
    const query = {
      top
    };
    return await ApiService.get(`/leaderboard-rank`, query);
  }
}

export default LeaderboardService;
