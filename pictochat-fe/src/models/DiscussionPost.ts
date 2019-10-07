import { PostAuthor, IPostAuthor } from './PostAuthor';
import { observable, action, IObservableArray } from 'mobx';

export interface IDiscussionPost {
  postId: string;
  parentPostId: string;
  discussionId: string;
  isRootPost: boolean;
  author: PostAuthor;
  imageSrc: string;
  postedDate: string;
  isHidden: boolean;
  commentCount?: number;
  replies?: IDiscussionPost[];
  hasMore?: boolean;
}

export class DiscussionPost implements IDiscussionPost {
  @observable postId: string;
  @observable parentPostId: string;
  @observable discussionId: string;
  // @observable imageId: string;
  @observable isRootPost: boolean;
  @observable author: IPostAuthor;
  @observable imageSrc: string; // URI for the post's image
  // @observable replyTreePath: string;
  @observable postedDate: string;
  // @observable createdAt: string;
  // @observable updatedAt: string;
  @observable isHidden: boolean;
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

  @action.bound
  removeReply(reply: DiscussionPost) {
    let idx = this.replies.findIndex(p => p.postId === reply.postId);
    this.replies.splice(idx, 1);
  }

  @action.bound
  addReplies(replies: DiscussionPost[]) {
    this.replies.push(...replies);
  }

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
    this.commentCount = other.commentCount;
    this.replies.replace(other.replies.toJS());
    this.hasMore = other.hasMore;
  }

  @action.bound
  clear() {
    this.replace(new DiscussionPost());
  }

  static fromJSON(post: IDiscussionPost): DiscussionPost {
    if (post.replies !== null || post.replies !== undefined) {
      post['replies'] = post.replies.map(replyJson => DiscussionPost.fromJSON(replyJson));
    }
    return new DiscussionPost(post);
  }
}
