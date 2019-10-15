import { LeaderboardRank } from "../models/leaderboard-rank";
import { QueryTypes, Op } from "sequelize";
import { User } from "../models/user";
import { SequelizeConnectionService } from "../services/sequelize-connection-service";
import { UserRepo } from "./user-repo";

const sequelize = SequelizeConnectionService.getInstance();

export class LeaderboardRankRepo {

  static async getTop(n: number): Promise<any[]> {
    let topUserMetrics = await LeaderboardRankRepo.getRankedAuthorMetrics(n);
    let topUserIds = topUserMetrics.map(userMetricRecord => userMetricRecord.authorId);
    let userDetails = await LeaderboardRankRepo.getUserDetails(topUserIds);
    return LeaderboardRankRepo.mergeUsersAndMetrics(userDetails, topUserMetrics);
  }

  private static async getRankedAuthorMetrics(top: number): Promise<any[]> {
    // const userColumns: any[] = User.PUBLIC_TABLE_COLUMNS.map(colName => [`author."${colName}"`, `user.${col}`]);

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

  private static mergeUsersAndMetrics(userDetails: { [userId: string]: User }, topUserMetrics: any[]): any[] {
    return topUserMetrics.map(userMetricRecord => {
      // Copying to avoid confusing bugs if function caller doesn't expect topUserMetrics to be mutated
      userMetricRecord = Object.assign({}, userMetricRecord);
      userMetricRecord.user = userDetails[userMetricRecord.authorId];
      return LeaderboardRank.fromJson(userMetricRecord);
    });
  }

  private static async getUserDetails(userIds) {
    let userDetails = await UserRepo.getUsers(true, { userId: { [Op.in]: userIds } });
    let userDetailMap = {};
    for (let user of userDetails) {
      userDetailMap[user.userId] = user;
    }
    return userDetailMap;
  }
}
