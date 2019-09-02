import { DiscussionPost } from '../models/discussion-post';
import { DiscussionThread } from '../models/discussion-thread';
import { DiscussionThreadSummary } from '../models/discussion-thread-summary';
import { DiscussionTreeNode } from '../models/discussion-tree-node';

export class DiscussionService {

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

  static async getReplyTreeForThread(discussionId: number): Promise<DiscussionTreeNode> {
    const posts: DiscussionPost[] = await DiscussionPost.getPathOrderedPostsInThread(discussionId);
    // Create reply tree
    let nodes: { [postId: number]: DiscussionTreeNode } = {};
    let rootPostId: number;
    posts.forEach((post: DiscussionPost) => {
      let treeNode = new DiscussionTreeNode(post);
      nodes[treeNode.getDataValue('postId')] = treeNode;

      let parentPostId: number = treeNode.getDataValue('parentPostId');
      if (parentPostId !== null) {
        let parentNode = nodes[parentPostId];
        parentNode.addReply(treeNode);
      } else if (treeNode.getDataValue('isRootPost')) {
        // Assuming no bugs in the post/threads creation logic there should only be one of these
        rootPostId = treeNode.getDataValue('postId');
      }
    });

    return nodes[rootPostId];
  }
}
