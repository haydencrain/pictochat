import { observable, computed, action, runInAction, IObservableValue, observe, spy, ObservableMap } from 'mobx';
import ObservableIntMap from '../utils/ObserableIntMap';
import { DiscussionPost, IDiscussionPost } from '../models/DiscussionPost';
import DiscussionService from '../services/DiscussionService';
import NewPostPayload from '../models/NewPostPayload';

/**
 * Coordinates updates to discussion data
 */
export default class DiscussionStore {
  @observable threadSummariesMap: ObservableIntMap<DiscussionPost> = new ObservableIntMap(observable.map(undefined, { name: "threadSummariesMap" }));
  @observable activeDiscussionRoot: DiscussionPost = new DiscussionPost();
  @observable activeDiscussionPosts: ObservableIntMap<DiscussionPost> = new ObservableIntMap(observable.map(undefined, { name: "activeDiscussionPosts" }));
  @observable isLoadingThreads = true;
  @observable isLoadingActiveDiscussion = true;

  constructor() {
    this.loadThreadSummaries()
      .catch((error) => { console.error('Error occured when fetching thread summaries:', error) });
    spy((change) => {
      if (change.type !== undefined) {
        console.log('CHANGE: ', change)
      }
    });
  }

  @computed
  get isLoading(): boolean {
    return this.isLoadingActiveDiscussion || this.isLoadingThreads;
  }

  @action.bound
  async loadThreadSummaries() {
    let jsonPosts: IDiscussionPost[] = await DiscussionService.getDiscussions();
    // Mobx @action will only track changes up to the first use of await in an an async function
    // so we need to run the rest in runInAction() to ensure anything observing the modified obserables
    // is updated
    runInAction(() => {
      this.isLoadingThreads = true;
      this.threadSummariesMap.clear();
      jsonPosts.forEach((postJson) => {
        this.threadSummariesMap.set(postJson.discussionId, this.parseJsonTree(postJson));
      });
      this.isLoadingThreads = false;
    });
  };

  @computed
  get threadSummaries(): DiscussionPost[] {
    return Array.from(this.threadSummariesMap.values());
  }

  @action.bound
  async setActiveDiscussion(postId: string) {
    this.isLoadingActiveDiscussion = true;
    let postJson = await DiscussionService.getPost(postId);
    runInAction(() => {
      let post = this.parseJsonTree(postJson, true);
      this.activeDiscussionRoot.replace(post);
      this.isLoadingActiveDiscussion = false;
    });
  }

  @action.bound
  async updatePostImage(postId: number, image: File) {
    this.isLoadingActiveDiscussion = true;
    try {
      const postJson = await DiscussionService.updatePost({ postId, image });
      const post = new DiscussionPost(postJson);
      runInAction(() => {
        this.activeDiscussionPosts.set(post.postId, post);
      });
    } finally {
      runInAction(() => (this.isLoadingActiveDiscussion = false));
    }
  }

  @action.bound
  async createPost(post: NewPostPayload): Promise<DiscussionPost> {
    const postCreationStrategy = (post.parentPostId) ? this.createReply : this.createThread;
    let newPost = await postCreationStrategy(post);
    return new DiscussionPost(newPost);
  }

  @action.bound
  async createReply(post: NewPostPayload): Promise<DiscussionPost> {
    this.isLoadingActiveDiscussion = true;
    let reply = new DiscussionPost(await DiscussionService.createPost(post))
    runInAction(() => {
      this.activeDiscussionPosts.set(reply.postId, reply);

      // Update thread summary
      if (this.threadSummariesMap.has(reply.discussionId)) {
        // Use of parseInt here fixes weird bug where mobx converts commentCount to string
        let commentCount = parseInt(this.threadSummariesMap.get(reply.discussionId).commentCount as any) + 1;
        this.threadSummariesMap.get(reply.discussionId).commentCount = commentCount;
      } else {
        // This isn't an error if users have been linked directly to a discussion page without accessing the main threads lists
        console.log(`Post reply (postId=${reply.postId}) created for a discusion (discussionId=${reply.discussionId}) thread that doesn't exist in DiscussionService`);
      }
      // Update local copy of parent
      if (this.activeDiscussionPosts.has(reply.parentPostId)) {
        this.activeDiscussionPosts.get(reply.parentPostId).replies.push(reply);
      }
      this.isLoadingActiveDiscussion = false;
    });
    return reply;
  }

  @action.bound
  async createThread(post: NewPostPayload): Promise<DiscussionPost> {
    let threadRoot: DiscussionPost = new DiscussionPost(await DiscussionService.createPost(post));
    runInAction(() => {
      this.threadSummariesMap.set(threadRoot.discussionId, threadRoot);
    });
    return threadRoot;
  }

  @action.bound
  async updatePost(data: { postId: number, image: File }): Promise<DiscussionPost> {
    let postJson: IDiscussionPost = await DiscussionService.updatePost(data);
    let post: DiscussionPost = await this.parseJsonTree(postJson, true);
    return post;
  }

  @action.bound
  private parseJsonTree(postJson: IDiscussionPost, shouldBuildPostMap: boolean = false): DiscussionPost {
    let repliesJson: IDiscussionPost[] = postJson.replies || [];
    let replies: DiscussionPost[] = repliesJson.map(post => this.parseJsonTree(post, shouldBuildPostMap));
    let post = new DiscussionPost({ ...postJson, ...{ replies } });
    if (shouldBuildPostMap) {
      if (this.activeDiscussionPosts.has(post.postId)) {
        // Using replace to avoid breaking any existing observer dependencies
        this.activeDiscussionPosts.get(post.postId).replace(post);
      } else {
        this.activeDiscussionPosts.set(post.postId, post);
      }
    }
    return post;
  }
}
