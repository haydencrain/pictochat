import { DiscussionThread } from './discussion-thread';

/**
 * Wrapper for DiscussionThread that adds aggregate thread metrics
 */
export class DiscussionThreadSummary {
  thread: DiscussionThread;
  commentCount: number;

  /**
   * @param thread DiscussionThread instance with allReplies and rootPost attributes populated
   */
  constructor(thread: DiscussionThread) {
    if (!thread.allReplies || !thread.rootPost) {
      throw Error('thread.allReplies and thread.rootPost must be populated when creating a DiscussionThreadSummary');
    }
    this.thread = thread;
    // -1 because root reply isn't counted
    this.commentCount = thread.allReplies.length - 1;
  }

  toFlatJSON(): any {
    const threadRaw: any = this.thread.toJSON();
    let threadFlat: any = {discussionId: threadRaw.discussionId};
    threadFlat = {...threadFlat, ...threadRaw.rootPost};
    threadFlat['commentCount'] = this.commentCount;
    return threadFlat;
  }
}
