import { DiscussionPost } from './discussion-post';

/**
 * Wrapper for DiscussionPost that exposes a tree interface
 */
export class DiscussionTreeNode extends DiscussionPost {
  replies: DiscussionTreeNode[];

  constructor(post: DiscussionPost) {
    super(post.toJSON());
    this.replies = [];
  }

  addReply(reply: DiscussionTreeNode) {
    this.replies.push(reply);
  }

  toJSON(): object {
    let baseJSON = super.toJSON();
    return {...baseJSON, ...{replies: this.replies}};
  }
}
