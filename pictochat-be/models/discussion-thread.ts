import { Sequelize, DataTypes, Model, QueryTypes } from 'sequelize';
import { SequelizeConnectionService } from '../services/sequelize-connection-service';
import { DiscussionPost } from './discussion-post';

const sequelize: Sequelize = SequelizeConnectionService.getInstance();

/**
 * Summary of posts with in one discussion thread
 * NOTE: This essentially implements a view over the DiscussionPost model's database table */
export class DiscussionThread {
  discussionId: string;
  rootPost: DiscussionPost;
  replyCount: number;

  constructor(data: { discussionId: string, rootPost: DiscussionPost, replyCount: number }) {
    this.discussionId = data.discussionId;
    this.rootPost = data.rootPost;
    this.replyCount = data.replyCount;
  }

  // INSTANCE METHODS

  /**
   * @returns A flat type-less object representation of this DiscussionThread */
  toFlatJSON(): any {
    const threadRaw: any = this.rootPost.toJSON();
    let threadFlat: any = { discussionId: threadRaw.discussionId };
    threadFlat = { ...threadFlat, ...threadRaw };
    // FIXME: Remove commentCount when front-end has been updated to use replyCount
    threadFlat['commentCount'] = this.replyCount;
    threadFlat['replyCount'] = this.replyCount;
    return threadFlat;
  }

  // STATIC/COLLECTION METHODS

  /**
   * @param string discussionId
   * @returns A DiscussionThread instance for the specified discussionId */
  static async findOne(discussionId: string): Promise<DiscussionThread> {
    let rootPost: DiscussionPost = await DiscussionPost.findOne({
      where: { discussionId: discussionId, ...DiscussionPost.isRootPostFilter() }
    });
    return new DiscussionThread(
      { rootPost, discussionId, replyCount: await rootPost.getDeepReplyCount() });
  }

  /**
   * @returns A DiscussionThread instance for all discussion threads */
  static async findAll(): Promise<DiscussionThread[]> {
    // Using application side join rather than one raw SQL query to avoid
    // cascading changes to this method when columns are added to the DiscussionPost model/table.
    let rootPosts: DiscussionPost[] = await DiscussionPost.findAll({ where: DiscussionPost.isRootPostFilter() });
    let replyCounts: { [discussionId: number]: number } = await DiscussionThread.getReplyCountsForAllThreads();
    let threads: DiscussionThread[] = [];
    console.log('replyCounts: ', replyCounts);
    for (let rootPost of rootPosts) {
      let discussionId = rootPost.discussionId;
      let thread = new DiscussionThread(
        { discussionId: discussionId, rootPost, replyCount: replyCounts[discussionId] });
      threads.push(thread);
    }
    console.log('threads: ', threads);
    return threads;
  }

  private static async getReplyCountsForAllThreads(): Promise<{ [discussionId: number]: number }> {
    let records: { discussionId: number, replyCount: number }[] = await sequelize.query(
      `SELECT "discussionId", COUNT(*) - 1 as "replyCount"
       FROM discussion_posts
       GROUP BY "discussionId"`,
      { raw: true, type: QueryTypes.SELECT }
    );
    console.log('getReplyCountsForAllThreads$records: ', records);
    let threadReplyCountMap = {};
    for (let record of records) {
      threadReplyCountMap[record.discussionId] = record.replyCount;
    }
    return threadReplyCountMap;
  }
}


// export class DiscussionThread_v1 extends Model {
//   rootPostId!: number;
//   discussionId!: number;

//   // attributes for all of the 'has' associations
//   rootPost?: DiscussionPost;
//   allReplies?: { postId: number }[]; // list of postIds for all replies, incl. replies to replies, etc.

//   /**
//    * @returns Promise for a list for DiscussionThreads with rootPost and allReplies populated
//    */
//   static async getThreadsPopulated(): Promise<DiscussionThread[]> {
//     let threads = await DiscussionThread.findAll({
//       include: [
//         {
//           model: DiscussionPost,
//           as: 'rootPost',
//           required: true,
//           attributes: DiscussionPost.ROOT_POST_ATTRIBUTES
//         },
//         { model: DiscussionPost, as: 'allReplies', attributes: ['postId'] }
//       ]
//     });
//     return threads;
//   }
// }

// DiscussionThread.init(
//   {
//     discussionId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
//     rootPostId: { type: DataTypes.INTEGER, allowNull: false }
//   },
//   {
//     sequelize,
//     modelName: 'DiscussionThread',
//     tableName: 'discussion_threads',
//     freezeTableName: true,
//     underscored: false
//   }
// );

// DiscussionThread.hasOne(
//   DiscussionPost,
//   { as: 'rootPost', foreignKey: 'postId', sourceKey: 'rootPostId', constraints: false }
// );
// DiscussionThread.hasMany(
//   DiscussionPost,
//   { as: 'allReplies', foreignKey: 'discussionId', sourceKey: 'discussionId', constraints: false }
// );
