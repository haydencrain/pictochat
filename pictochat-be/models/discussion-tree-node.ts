import { DiscussionPost } from './discussion-post';

/**
 * Wrapper for DiscussionPost that exposes a tree interface
 */
export class DiscussionTreeNode extends DiscussionPost {
  replies: DiscussionTreeNode[];
  commentCount?: number; // Only populated for the root node
  hasMore: boolean;

  /**
   * For internal use only!
   */
  private constructor(post: DiscussionPost, commentCount?: number) {
    super(post.toJSON());
    this.replies = [];
    this.hasMore = false;
    if (post.author) {
      this.author = post.author;
    }
    if (commentCount !== undefined) {
      this.commentCount = commentCount;
    }
  }

  addReply(reply: DiscussionTreeNode) {
    this.replies.push(reply);
  }

  toJSON(): object {
    let baseJSON = super.toJSON();
    let repliesJSON = this.replies.map(reply => reply.toJSON());
    baseJSON = {
      ...baseJSON,
      ...{ replies: repliesJSON },
      author: this.author.toJSON(),
      hasMore: this.hasMore
    };
    if (this.commentCount !== null && this.commentCount !== undefined) {
      baseJSON['commentCount'] = this.commentCount;
    }
    return baseJSON;
  }

  // Factory
  static async makeInstance(post: DiscussionPost): Promise<DiscussionTreeNode> {
    let commentCount: number = null;
    if (post.isRootPost) {
      commentCount = await post.getDeepReplyCount();
    }
    return new DiscussionTreeNode(post, commentCount);
  }
}
