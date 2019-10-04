import { observable, computed, action, runInAction, IObservableValue, observe, spy, ObservableMap } from 'mobx';
import ObservableIntMap from '../utils/ObserableIntMap';
import { DiscussionPost, IDiscussionPost } from '../models/DiscussionPost';
import DiscussionService from '../services/DiscussionService';
import NewPostPayload from '../models/NewPostPayload';
import PaginationResult from '../models/PaginationResult';

// TODO: Move to env variable
const PAGINATION_LIMIT = 10;

/**
 * Coordinates updates to discussion data
 */
export default class DiscussionStore {
  // pagination variables
  @observable threadSummariesHasMorePages = true;
  @observable threadSummariesNextStart = 0;
  @observable threadSummariesMap: ObservableIntMap<DiscussionPost> = new ObservableIntMap(
    observable.map(undefined, { name: 'threadSummariesMap' })
  );
  @observable activeDiscussionRoot: DiscussionPost = new DiscussionPost();
  @observable activeDiscussionPosts: ObservableIntMap<DiscussionPost> = new ObservableIntMap(
    observable.map(undefined, { name: 'activeDiscussionPosts' })
  );
  @observable isLoadingThreads = false;
  @observable isLoadingActiveDiscussion = false;

  constructor() {
    // this.getNewThreadSummaries().catch(error => {
    //   console.error('Error occured when fetching thread summaries:', error);
    // });
  }

  @computed
  get isLoading(): boolean {
    return this.isLoadingActiveDiscussion || this.isLoadingThreads;
  }

  @action.bound
  async getNewThreadSummaries() {
    this.isLoadingThreads = true;
    const paginationResult = await DiscussionService.getDiscussions(PAGINATION_LIMIT);
    // Mobx @action will only track changes up to the first use of await in an an async function
    // so we need to run the rest in runInAction() to ensure anything observing the modified obserables
    // is updated
    runInAction(() => {
      this.threadSummariesMap.clear();
      this.setThreadSummaries(paginationResult);
      this.isLoadingThreads = false;
    });
  }

  @action.bound
  setThreadSummaries(paginationResult: PaginationResult<IDiscussionPost>) {
    paginationResult.results.forEach(postJson => {
      this.threadSummariesMap.set(postJson.discussionId, this.parseJsonTree(postJson));
    });
    this.threadSummariesHasMorePages = paginationResult.hasNextPage;
    this.threadSummariesNextStart = paginationResult.nextStart;
  }

  @computed
  get threadSummaries(): DiscussionPost[] {
    return Array.from(this.threadSummariesMap.values());
  }

  @action.bound
  async setActiveDiscussion(postId: string) {
    this.isLoadingActiveDiscussion = true;
    try {
      let postJson = await DiscussionService.getPost(postId);
      runInAction(() => {
        let post = this.parseJsonTree(postJson, true);
        this.activeDiscussionRoot.replace(post);
      });
    } finally {
      runInAction(() => (this.isLoadingActiveDiscussion = false));
    }
  }

  @action.bound
  async deletePost(postId: number) {
    this.isLoadingActiveDiscussion = true;
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
      runInAction(() => (this.isLoadingActiveDiscussion = false));
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
  async createPost(post: NewPostPayload): Promise<DiscussionPost> {
    const postCreationStrategy = post.parentPostId ? this.createReply : this.createThread;
    let newPost = await postCreationStrategy(post);
    return new DiscussionPost(newPost);
  }

  @action.bound
  async createReply(post: NewPostPayload): Promise<DiscussionPost> {
    this.isLoadingActiveDiscussion = true;
    let reply = new DiscussionPost(await DiscussionService.createPost(post));
    runInAction(() => {
      this.putPostInActiveMap(reply);

      // Update thread summary
      if (this.threadSummariesMap.has(reply.discussionId)) {
        // Use of parseInt here fixes weird bug where mobx converts commentCount to string
        let commentCount = parseInt(this.threadSummariesMap.get(reply.discussionId).commentCount as any) + 1;
        this.threadSummariesMap.get(reply.discussionId).commentCount = commentCount;
      } else {
        // This isn't an error if users have been linked directly to a discussion page without accessing the main threads lists
        console.log(
          `Post reply (postId=${reply.postId}) created for a discusion (discussionId=${reply.discussionId}) thread that doesn't exist in DiscussionService`
        );
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
  private parseJsonTree(postJson: IDiscussionPost, shouldBuildPostMap: boolean = false): DiscussionPost {
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
