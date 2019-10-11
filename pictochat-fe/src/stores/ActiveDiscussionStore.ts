import { observable, computed, action, runInAction, IObservableValue, observe, spy, ObservableMap } from 'mobx';
import ObservableIntMap from '../utils/ObserableIntMap';
import { DiscussionPost, IDiscussionPost } from '../models/store/DiscussionPost';
import DiscussionService from '../services/DiscussionService';
import NewPostPayload from '../models/NewPostPayload';
import { SortTypes, SortValue } from '../models/SortTypes';
import config from '../config';
import DiscussionStore from './DiscussionStore';

const { PAGINATION_LIMIT } = config.discussion;

/**
 * Coordinates updates to discussion data
 */
export default class ActiveDiscussionStore {
  discussionStore: DiscussionStore;
  @observable activeDiscussionSort: SortValue = SortTypes.NEW;
  @observable activeDiscussionRootId: string;
  @observable activeDiscussionRoot: DiscussionPost = new DiscussionPost();
  @observable activeDiscussionPosts: ObservableIntMap<DiscussionPost> = new ObservableIntMap(
    observable.map(undefined, { name: 'activeDiscussionPosts' })
  );
  @observable isLoadingActiveDiscussion = false;
  @observable isLoadingReplies = false;

  constructor(discussionStore: DiscussionStore) {
    this.discussionStore = discussionStore;
  }

  @action.bound
  setActiveDiscussionSort(sort: SortValue) {
    this.activeDiscussionSort = sort;
    this.getNewReplies(this.activeDiscussionRootId);
  }

  @action.bound
  async setActiveDiscussion(postId: string) {
    this.isLoadingActiveDiscussion = true;
    this.isLoadingReplies = true;
    this.activeDiscussionRoot.clear();
    this.activeDiscussionPosts.clear();
    try {
      let postJson = await DiscussionService.getPost(postId, this.activeDiscussionSort, PAGINATION_LIMIT);
      runInAction(() => {
        let post = this.parseJsonTree(postJson);
        this.activeDiscussionRootId = postId;
        this.activeDiscussionRoot.replace(post);
      });
    } finally {
      runInAction(() => {
        this.isLoadingActiveDiscussion = false;
        this.isLoadingReplies = false;
      });
    }
  }

  @action.bound
  async getNewReplies(postId: string) {
    this.isLoadingReplies = true;
    this.activeDiscussionPosts.clear();
    try {
      let postJson = await DiscussionService.getPost(postId, this.activeDiscussionSort, PAGINATION_LIMIT);
      runInAction(() => {
        this.parseJsonTree(postJson);
      });
    } finally {
      runInAction(() => {
        this.isLoadingReplies = false;
      });
    }
  }

  @action.bound
  async getExtraReplies(parentPostId: string, after?: string) {
    this.isLoadingReplies = true;
    try {
      const postJson = await DiscussionService.getPost(
        parentPostId,
        this.activeDiscussionSort,
        PAGINATION_LIMIT,
        after
      );
      runInAction(() => {
        let replies: DiscussionPost[] = postJson.replies.map(post => this.parseJsonTree(post));
        const post = this.activeDiscussionPosts.get(postJson.postId);
        post.hasMore = postJson.hasMore;
        post.addReplies(replies);
      });
    } finally {
      runInAction(() => (this.isLoadingReplies = false));
    }
  }

  @action.bound
  async deletePost(postId: number) {
    this.isLoadingActiveDiscussion = true;
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
        const post = this.activeDiscussionPosts.get(postId);
        if (this.activeDiscussionPosts.has(post.parentPostId)) {
          const parent = this.activeDiscussionPosts.get(post.parentPostId);
          parent.removeReply(post);
        }

        this.activeDiscussionPosts.delete(post.postId);

        if (parseInt(this.activeDiscussionRoot.postId) === postId) {
          this.activeDiscussionRoot.clear();
        }
      }
    } finally {
      runInAction(() => {
        this.isLoadingActiveDiscussion = false;
        this.isLoadingReplies = false;
      });
    }
  }

  @action.bound
  async updatePostImage(postId: number, image: File) {
    this.isLoadingActiveDiscussion = true;
    try {
      const postJson = await DiscussionService.updatePost({ postId, image });
      const post = new DiscussionPost(postJson);
      runInAction(() => {
        this.putPostInActiveMap(post);
      });
    } finally {
      runInAction(() => (this.isLoadingActiveDiscussion = false));
    }
  }

  @action.bound
  async createReply(post: NewPostPayload): Promise<DiscussionPost> {
    this.isLoadingReplies = true;
    try {
      let reply = new DiscussionPost(await DiscussionService.createPost(post));
      runInAction(() => {
        this.putPostInActiveMap(reply);
        this.discussionStore.updateCommentCount(reply);
        // Update local copy of parent
        if (this.activeDiscussionPosts.has(reply.parentPostId)) {
          this.activeDiscussionPosts.get(reply.parentPostId).replies.push(reply);
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
    if (this.activeDiscussionPosts.has(post.postId)) {
      this.activeDiscussionPosts.get(post.postId).replace(post);
    } else {
      this.activeDiscussionPosts.set(post.postId, post);
    }
  }
}
