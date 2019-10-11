import { PostAuthor, IPostAuthor } from './PostAuthor';
import { observable, action, IObservableArray } from 'mobx';

export interface IDiscussionPost {
  /**
   * The id of the post
   */
  postId: string;
  /**
   * The id of the parent post (if it's a reply)
   */
  parentPostId: string;
  /**
   * The post's discussion id
   */
  discussionId: string;
  /**
   * if the post is a discussion post, then it will be true
   */
  isRootPost: boolean;
  /**
   * The author of the post
   */
  author: PostAuthor;
  /**
   * The url (or base64 string) of the post's image
   */
  imageSrc: string;
  /**
   * The date the post was submitted
   */
  postedDate: string;
  /**
   * Will be set to true if the post has been deleted
   */
  isHidden: boolean;
  /**
   * The number of reactions the post has
   */
  reactionsCount: number;
  /**
   * The number of comments the post has. (NOTE: This will only appear on discussion posts, and will be `null` for reply posts).
   */
  commentCount?: number;
  /**
   * The posts that have replied to the post (if any). NOTE: if `hasMore` is `true`, then this array does not contain
   * the entire list of replies yet
   */
  replies?: IDiscussionPost[];
  /**
   * If set to true, the post has more replies to fetch from the back end.
   */
  hasMore?: boolean;
}

/**
 * Creates an mobx ovservable instance of a DiscussionPost, and provides extra methods handling CRUD updates,
 * including communicating to the Discussion Api Services.
 * @class
 */
export class DiscussionPost implements IDiscussionPost {
  @observable postId: string;
  @observable parentPostId: string;
  @observable discussionId: string;
  @observable isRootPost: boolean;
  @observable author: IPostAuthor;
  @observable imageSrc: string;
  @observable postedDate: string;
  @observable isHidden: boolean;
  @observable reactionsCount: number;
  @observable commentCount?: number = 0;
  @observable replies?: IObservableArray<DiscussionPost> = observable.array();
  @observable hasMore?: boolean = false;

  constructor(data?: IDiscussionPost) {
    if (data) {
      this.postId = data.postId;
      this.parentPostId = data.parentPostId;
      this.discussionId = data.discussionId;
      this.isRootPost = data.isRootPost;
      this.author = data.author;
      this.imageSrc = data.imageSrc;
      this.postedDate = data.postedDate;
      this.isHidden = data.isHidden;
      this.reactionsCount = data.reactionsCount;
      if (data.commentCount) {
        this.commentCount = data.commentCount;
      }
      if (data.replies) {
        this.replies.replace(data.replies as DiscussionPost[]);
      }
      if (data.hasMore) {
        this.hasMore = data.hasMore;
      }
    }
  }

  /**
   * Removes a reply from the post's `replies` array
   * @function
   * @param { DiscussionPost } reply - The reply to remove
   */
  @action.bound
  removeReply(reply: DiscussionPost) {
    let idx = this.replies.findIndex(p => p.postId === reply.postId);
    this.replies.splice(idx, 1);
  }

  /**
   * Adds more replies to the post's replies array
   * @function
   * @param { DiscussionPost[] } replies - The array of replies to add
   */
  @action.bound
  addReplies(replies: DiscussionPost[]) {
    this.replies.push(...replies);
  }

  /**
   * Replaces this instance's post with another instance of a post
   * @function
   * @param { DiscussionPost } other - The post to replace this instance with
   */
  @action.bound
  replace(other: DiscussionPost) {
    this.postId = other.postId;
    this.parentPostId = other.parentPostId;
    this.discussionId = other.discussionId;
    this.isRootPost = other.isRootPost;
    this.author = other.author;
    this.imageSrc = other.imageSrc;
    this.postedDate = other.postedDate;
    this.isHidden = other.isHidden;
    this.reactionsCount = other.reactionsCount;
    this.commentCount = other.commentCount;
    this.replies.replace(other.replies.toJS());
    this.hasMore = other.hasMore;
  }

  /**
   * Replaces this instance's post with an empty post
   * @function
   */
  @action.bound
  clear() {
    this.replace(new DiscussionPost());
  }

  /**
   * Creates a new instance from a JSON representation of this class
   * @param { IDiscussionPost } post - A JSON representation of this class
   */
  static fromJSON(post: IDiscussionPost): DiscussionPost {
    if (post.replies !== null || post.replies !== undefined) {
      post['replies'] = post.replies.map(replyJson => DiscussionPost.fromJSON(replyJson));
    }
    return new DiscussionPost(post);
  }
}
