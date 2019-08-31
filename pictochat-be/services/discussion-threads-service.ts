import { DiscussionThread } from '../models/discussion-thread';
import { DiscussionThreadSummary } from '../models/discussion-thread-summary';

export class DiscussionThreadService {

  /** Creates a list of summaries for each thread containing the rootPost
   *  and agggregate metrics (e.g. comment count).
   */
  static async getThreadSummaries(): Promise<DiscussionThreadSummary[]> {
    const threads: DiscussionThread[] = await DiscussionThread.getThreadsPopulated();

    let threadSummaries: DiscussionThreadSummary[] = threads.map((thread) => {
      return new DiscussionThreadSummary(thread);
    });

    return threadSummaries;
  }
}
