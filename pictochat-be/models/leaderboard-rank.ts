import { User } from './user';
import { SequelizeConnectionService } from '../services/sequelize-connection-service';
import { QueryTypes, fn, col, Op } from 'sequelize';
// import { DiscussionPost } from './discussion-post';

const sequelize = SequelizeConnectionService.getInstance();

export class LeaderboardRank {
  user: User;
  rank: number;
  // Metrics
  postCount: number;

  constructor(user, rank, postCount) {
    this.user = user;
    this.rank = rank;
    this.postCount = postCount;
  }

  //// INSTANCE METHODS ////

  toJSON(): any {
    let json = {
      user: this.user.toJSON(),
      rank: this.rank,
      postCount: this.postCount
    };
    return json;
  }

  //// STATIC/COLLECTION METHODS ////

  static fromJson(json) {
    return new LeaderboardRank(json.user, json.rank, json.postCount);
  }

  static async getTop(n: number): Promise<any[]> {
    let topUserMetrics = await LeaderboardRank.getRankedAuthorMetrics(n);
    let topUserIds = topUserMetrics.map(userMetricRecord => userMetricRecord.authorId);
    let userDetails = await LeaderboardRank.getUserDetails(topUserIds);
    return LeaderboardRank.mergeUsersAndMetrics(userDetails, topUserMetrics);
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

    // const postCountFn = fn('COUNT', col('"discussionPost"."postId"'));
    // const metricFunctions = [[postCountFn, 'postCount']];

    // let userMetrics: any[] = await DiscussionPost.findAll({
    //   attributes: ['authorId'].concat(metricFunctions),
    //   // include: [{ model: User, attributes: User.PUBLIC_TABLE_COLUMNS, as: 'author', required: true }],
    //   where: DiscussionPost.defaultFilter(),
    //   group: ['authorId'],
    //   limit: top,
    //   nest: true
    // });

    // TODO: Sort in database not in the NodeJS process
    // Sort descending by postCount
    // userMetrics.sort((row1, row2) => row2.postCount - row1.postCount);

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
    let userDetails = await User.getUsers(true, { userId: { [Op.in]: userIds } });
    let userDetailMap = {};
    for (let user of userDetails) {
      userDetailMap[user.userId] = user;
    }
    return userDetailMap;
  }
}
