import { LeaderboardRank } from "../models/leaderboard-rank";
import { QueryTypes } from "sequelize";
import { User } from "../models/user";
import { SequelizeConnection } from "../utils/sequelize-connection";
import { UserRepo } from "./user-repo";

const sequelize = SequelizeConnection.getInstance();

export class LeaderboardRankRepo {

  /**
   * Get the top n leaderboard ranks
   * @param n
   */
  static async getTop(n: number): Promise<any[]> {
    let topUserMetrics = await LeaderboardRankRepo.getRankedAuthorMetrics(n);
    let topUserIds = topUserMetrics.map(userMetricRecord => userMetricRecord.authorId);
    let userDetails = await LeaderboardRankRepo.getUserDetails(topUserIds);
    return LeaderboardRankRepo.mergeUsersAndMetrics(userDetails, topUserMetrics);
  }

  /**
   * Get the scores for the highest scoring users
   * @param top the number of users to include
   */
  private static async getRankedAuthorMetrics(top: number): Promise<any[]> {
    let userMetrics: any[] = await sequelize.query(
      `SELECT "authorId", COUNT(*) AS "postCount"
      FROM discussion_posts
      WHERE "isDeleted" = FALSE AND "isHidden" = FALSE
      GROUP BY "authorId"
      ORDER BY COUNT(*) DESC
      LIMIT ${top}`,
      { raw: true, type: QueryTypes.SELECT }
    );

    userMetrics.forEach((userMetricRecord, i) => (userMetricRecord.rank = i));

    return userMetrics;
  }

  /**
   * Get LeaderboardRanks for the userIds in topUserMetrics
   *
   * @param userDetails A map of User objects keyed by userId
   * @param topUserMetrics A JSON with format {userId, rank, <metrics...>}
   */
  private static mergeUsersAndMetrics(
    userDetails: { [userId: string]: User },
    topUserMetrics: { authorId: number, postCount: number }[]
  ): LeaderboardRank[] {
    let ranks: LeaderboardRank[] = [];
    for (let metrics of topUserMetrics) {
      // NOTE: users that have been deleted/disabled will be missing
      // from userDetails (and shouldn't be included in the ranks)
      if (userDetails[metrics.authorId] !== undefined) {
        // Copying to avoid confusing bugs if function caller
        // doesn't expect topUserMetrics to be mutated
        metrics = Object.assign({}, metrics);
        metrics['user'] = userDetails[metrics.authorId];
        ranks.push(LeaderboardRank.fromJson(metrics));
      }
    }

    return ranks;
  }

  /**
   * Get a map (keyed by userId) of user objects for the specified userIds
   * @param userIds
   */
  private static async getUserDetails(userIds: number[]) {
    let userDetails = await UserRepo.getUsers(true, userIds);
    let userDetailMap = {};
    for (let user of userDetails) {
      userDetailMap[user.userId] = user;
    }
    return userDetailMap;
  }
}
