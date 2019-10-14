import { Sequelize } from 'sequelize';
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

  constructor(discussionId: string, rootPost: DiscussionPost, replyCount: number) {
    this.discussionId = discussionId;
    this.rootPost = rootPost;
    this.replyCount = replyCount;
  }

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

  static sortByCommentCount(threads: DiscussionThread[]): DiscussionThread[] {
    return threads.sort((d1, d2) => d2.replyCount - d1.replyCount);
  }
}
