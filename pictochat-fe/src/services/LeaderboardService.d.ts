import { ILeaderboardRank } from '../models/store/LeaderboardRank';
/**
 * Implements HTTP Requests for the `'/leaderboard-rank'` API endpoint
 * @class
 * @static
 */
export declare class LeaderboardService {
    static getLeaderboardRanks(top: number): Promise<ILeaderboardRank[]>;
}
export default LeaderboardService;
