import { DiscussionPost } from '../models/discussion-post';
import { DiscussionThread } from '../models/discussion-thread';
import { SortValue, SortTypes } from '../utils/sort-types';
import { QueryTypes } from 'sequelize/types';
import { DiscussionPostRepo } from '../repositories/discussion-post-repo';
import { SequelizeConnectionService } from '../services/sequelize-connection-service';

const sequelize = SequelizeConnectionService.getInstance();

/**
 * Summary of posts with in one discussion thread
 * NOTE: This essentially implements a view over the DiscussionPost model's database table */
export class DiscussionThreadRepo {

  /**
   * @param discussionId
   * @returns A DiscussionThread instance for the specified discussionId */
  static async getDiscussionThread(discussionId: string): Promise<DiscussionThread> {
    const rootPost: DiscussionPost = await DiscussionPostRepo.getDiscussionRoot(discussionId);
    return new DiscussionThread(discussionId, rootPost, await rootPost.getDeepReplyCount());
  }

  /**
   * @returns A DiscussionThread instance for all discussion threads */
  static async getDiscussionThreads(sortType: SortValue): Promise<DiscussionThread[]> {
    // Using application side join rather than one raw SQL query to avoid
    // cascading changes to this method when columns are added to the DiscussionPost model/table.
    const rootPosts = await DiscussionPostRepo.getDiscussionRootPosts(sortType);
    const replyCounts: { [discussionId: number]: number } = await DiscussionThreadRepo.getReplyCountsForAllThreads();
    let threads: DiscussionThread[] = [];
    for (let rootPost of rootPosts) {
      const discussionId = rootPost.discussionId;
      const thread = new DiscussionThread(discussionId, rootPost, replyCounts[discussionId]);
      threads.push(thread);
    }

    // we can sort by comment count now, as we have finally computed to reply counts
    if (sortType === SortTypes.COMMENTS) {
      threads = DiscussionThread.sortByCommentCount(threads);
    }

    return threads;
  }

  private static async getReplyCountsForAllThreads(): Promise<{ [discussionId: number]: number }> {
    const records: { discussionId: number; replyCount: number }[] = await sequelize.query(
      `SELECT "discussionId", COUNT(*) - 1 as "replyCount"
       FROM discussion_posts
       WHERE "isDeleted" = FALSE
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
