import { Sequelize, QueryTypes } from 'sequelize';
import { SequelizeConnectionService } from '../services/sequelize-connection-service';
import { DiscussionPost } from './discussion-post';
import { User } from './user';

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
   * @param discussionId
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
    // const userJoin = { model: User, as: 'author', required: true, attributes: User.PUBLIC_ATTRIBUTES };
    // let rootPosts: DiscussionPost[] = await DiscussionPost.findAll({
    //   where: DiscussionPost.isRootPostFilter(),
    //   include: [userJoin]
    // });
    let rootPosts: DiscussionPost[] = await DiscussionPost.findDiscussionPosts({ where: DiscussionPost.isRootPostFilter() });
    let replyCounts: { [discussionId: number]: number } = await DiscussionThread.getReplyCountsForAllThreads();
    let threads: DiscussionThread[] = [];
    for (let rootPost of rootPosts) {
      let discussionId = rootPost.discussionId;
      let thread = new DiscussionThread(
        { discussionId: discussionId, rootPost, replyCount: replyCounts[discussionId] });
      threads.push(thread);
    }
    return threads;
  }

  private static async getReplyCountsForAllThreads(): Promise<{ [discussionId: number]: number }> {
    let records: { discussionId: number, replyCount: number }[] = await sequelize.query(
      `SELECT "discussionId", COUNT(*) - 1 as "replyCount"
       FROM discussion_posts
       GROUP BY "discussionId"`,
      { raw: true, type: QueryTypes.SELECT }
    );
    let threadReplyCountMap = {};
    for (let record of records) {
      threadReplyCountMap[record.discussionId] = record.replyCount;
    }
    return threadReplyCountMap;
  }
}
