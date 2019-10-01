import ApiService from './ApiService';
import { ILeaderboardRank } from '../models/LeaderboardRank';

export class LeaderboardService {
  static async getLeaderboardRanks(top: number): Promise<ILeaderboardRank[]> {
    return await ApiService.get(`/leaderboard-rank?top=${top}`);
  }
}

export default LeaderboardService;
