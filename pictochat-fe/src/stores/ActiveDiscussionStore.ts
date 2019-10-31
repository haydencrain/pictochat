import { observable, action, runInAction } from 'mobx';
import ObservableIntMap from '../utils/ObserableIntMap';
import { DiscussionPost, IDiscussionPost } from '../models/store/DiscussionPost';
import DiscussionService from '../services/DiscussionService';
import NewPostPayload from '../models/NewPostPayload';
import { SortTypes, SortValue } from '../models/SortTypes';
import config from '../config';
import DiscussionStore from './DiscussionStore';

interface IActiveDiscussionStore {
  /**
   * We need access to DiscussionStore so that we are able to update the comment count of the root discussion
   */
  discussionStore: DiscussionStore;
  /**
   * The currently active sort for the active discussion's replies
   */
  sort: SortValue;
  /**
   * The currently active discussion's id
   */
  postId: string;
  /**
   * The currently active discussion
   */
  discussion: DiscussionPost;
  /**
   * A map of all posts related to the active discussion. This map also includes the active discussion's post as well.
   */
  postsMap: ObservableIntMap<DiscussionPost>;
  /**
   * This will be true if the Store is currently in tne process of fetching the active discussion.
   */
  isLoadingRoot: boolean;
  /**
   * This will be true if the Store is currently in tne process of fetching the active discussion's replies.
   */
  isLoadingReplies: boolean;
}

const { PAGINATION_LIMIT } = config.discussion;

/**
 * Creates an observable instance that coordinates updates to discussion data.
 * For example, When a user access a route such as `/dicussion/23`, it will handle fetching the discussion postwith an id of '23',
 * and also fetch its replies
 * @class
 */
export default class ActiveDiscussionStore implements IActiveDiscussionStore {
  discussionStore: DiscussionStore;
  @observable sort: SortValue = SortTypes.NEW;
  @observable postId: string;
  @observable discussion: DiscussionPost = new DiscussionPost();
  @observable postsMap: ObservableIntMap<DiscussionPost> = new ObservableIntMap(
    observable.map(undefined, { name: 'postsMap' })
  );
  @observable isLoadingRoot = false;
  @observable isLoadingReplies = false;

  constructor(discussionStore: DiscussionStore) {
    this.discussionStore = discussionStore;
  }

  /**
   * Sets the currently active sort, and then re-fetches the replies list
   * @function
   * @param sort - The new sort to use
   */
  @action.bound
  setSort(sort: SortValue) {
    this.sort = sort;
    this.getNewReplies(this.postId);
  }

  /**
   * Sets a new active discussion
   * @tunction
   * @param postId - The id of the new post
   */
  @action.bound
  async setDiscussion(postId: string) {
    this.isLoadingRoot = true;
    this.isLoadingReplies = true;
    this.discussion.clear();
    this.postsMap.clear();
    try {
      let postJson = await DiscussionService.getPost(postId, this.sort, PAGINATION_LIMIT);
      runInAction(() => {
        let post = this.parseJsonTree(postJson);
        this.postId = postId;
        this.discussion.replace(post);
      });
    } catch (error) {
      throw error;
    } finally {
      runInAction(() => {
        this.isLoadingRoot = false;
        this.isLoadingReplies = false;
      });
    }
  }

  /**
   * Fetches a new replies list
   * @function
   * @param postId - The id of the post to fetch the replies from
   */
  @action.bound
  private async getNewReplies(postId: string) {
    this.isLoadingReplies = true;
    this.postsMap.clear();
    try {
      let postJson = await DiscussionService.getPost(postId, this.sort, PAGINATION_LIMIT);
      runInAction(() => {
        this.parseJsonTree(postJson);
      });
    } finally {
      runInAction(() => {
        this.isLoadingReplies = false;
      });
    }
  }

  /**
   * Gets more replies
   * @function
   * @param parentPostId - The id of the post fetch the replies from
   * @param after - The post id where the extra replies should start from
   */
  @action.bound
  async getExtraReplies(parentPostId: string, after?: string) {
    this.isLoadingReplies = true;
    try {
      const postJson = await DiscussionService.getPost(parentPostId, this.sort, PAGINATION_LIMIT, after);
      runInAction(() => {
        let replies: DiscussionPost[] = postJson.replies.map(post => this.parseJsonTree(post));
        const post = this.postsMap.get(postJson.postId);
        post.hasMore = postJson.hasMore;
        post.addReplies(replies);
      });
    } finally {
      runInAction(() => (this.isLoadingReplies = false));
    }
  }

  /**
   * Deletes a post
   * @function
   * @param postId - The id of the post to delete
   */
  @action.bound
  async deletePost(postId: number) {
    this.isLoadingRoot = true;
    this.isLoadingReplies = true;
    try {
      let postJson: IDiscussionPost = await DiscussionService.deletePost(postId);
      // FIXME: Find more explicit way of detecting if post should be deleted
      if (!!postJson) {
        // Post was hidden
        let post = new DiscussionPost(postJson);
        this.putPostInActiveMap(post);
      } else {
        // Post was deleted
        const post = this.postsMap.get(postId);
        if (this.postsMap.has(post.parentPostId)) {
          const parent = this.postsMap.get(post.parentPostId);
          parent.removeReply(post);
        }

        this.postsMap.delete(post.postId);

        if (parseInt(this.discussion.postId) === postId) {
          this.discussion.clear();
        }
      }
    } finally {
      runInAction(() => {
        this.isLoadingRoot = false;
        this.isLoadingReplies = false;
      });
    }
  }

  /**
   * Updates a Post with a new image
   * @function
   * @param postId - The id of the post to update
   * @param image - The image file to update the post with
   */
  @action.bound
  async updatePostImage(postId: number, image: File) {
    this.isLoadingRoot = true;
    try {
      const postJson = await DiscussionService.updatePost({ postId, image });
      const post = new DiscussionPost(postJson);
      runInAction(() => {
        this.putPostInActiveMap(post);
      });
    } finally {
      runInAction(() => (this.isLoadingRoot = false));
    }
  }

  /**
   * Creates a new reply, and adds it to the map
   * @function
   * @param post - The mew post to create
   */
  @action.bound
  async createReply(post: NewPostPayload): Promise<DiscussionPost> {
    this.isLoadingReplies = true;
    try {
      let reply = new DiscussionPost(await DiscussionService.createPost(post));
      runInAction(() => {
        this.putPostInActiveMap(reply);
        this.discussionStore.updateCommentCount(reply);
        // Update local copy of parent
        if (this.postsMap.has(reply.parentPostId)) {
          this.postsMap.get(reply.parentPostId).replies.push(reply);
        }
      });
      return new DiscussionPost(reply);
    } catch (e) {
      alert(e.message);
    } finally {
      runInAction(() => {
        this.isLoadingReplies = false;
      });
    }
  }

  @action.bound
  private parseJsonTree(postJson: IDiscussionPost, shouldBuildPostMap: boolean = true): DiscussionPost {
    let repliesJson: IDiscussionPost[] = postJson.replies || [];
    let replies: DiscussionPost[] = repliesJson.map(post => this.parseJsonTree(post, shouldBuildPostMap));
    let post = new DiscussionPost({ ...postJson, ...{ replies } });
    if (shouldBuildPostMap) {
      this.putPostInActiveMap(post);
    }
    return post;
  }

  @action.bound
  private putPostInActiveMap(post: DiscussionPost) {
    if (this.postsMap.has(post.postId)) {
      this.postsMap.get(post.postId).replace(post);
    } else {
      this.postsMap.set(post.postId, post);
    }
  }
}
