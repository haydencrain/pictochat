import { observable, computed, action, runInAction, IObservableValue, observe, spy, ObservableMap } from 'mobx';
import ObservableIntMap from '../utils/ObserableIntMap';
import { DiscussionPost, IDiscussionPost } from '../models/store/DiscussionPost';
import DiscussionService from '../services/DiscussionService';
import NewPostPayload from '../models/NewPostPayload';
import PaginationResult from '../models/PaginationResult';
import { SortTypes, SortValue } from '../models/SortTypes';
import config from '../config';

const { PAGINATION_LIMIT } = config.discussion;

/**
 * Coordinates updates to discussion data
 */
export default class DiscussionStore {
  @observable threadSummariesSort: SortValue = SortTypes.NEW;
  @observable threadSummariesHasMore = true;
  @observable threadSummariesNextStart = 0;
  @observable threadSummariesMap: ObservableMap<any, DiscussionPost> = observable.map(undefined, {
    name: 'threadSummariesMap'
  });
  @observable isLoadingThreads = false;

  @computed
  get isLoading(): boolean {
    return this.isLoadingThreads;
  }

  @action.bound
  setThreadSummariesSort(sort: SortValue) {
    this.threadSummariesSort = sort;
    this.getNewThreadSummaries();
  }

  @action.bound
  async getNewThreadSummaries() {
    this.isLoadingThreads = true;
    this.threadSummariesMap.clear();
    this.threadSummariesNextStart = 0;
    this.threadSummariesHasMore = true;
    const paginationResult = await DiscussionService.getDiscussions(this.threadSummariesSort, PAGINATION_LIMIT);
    // Mobx @action will only track changes up to the first use of await in an an async function
    // so we need to run the rest in runInAction() to ensure anything observing the modified obserables
    // isLoadingReplies updated
    runInAction(() => {
      this.setThreadSummaries(paginationResult);
      this.isLoadingThreads = false;
    });
  }

  @action.bound
  async getMoreThreadSummaries() {
    this.isLoadingThreads = true;
    const paginationResult = await DiscussionService.getDiscussions(
      this.threadSummariesSort,
      PAGINATION_LIMIT,
      this.threadSummariesNextStart
    );
    runInAction(() => {
      this.setThreadSummaries(paginationResult);
      this.isLoadingThreads = false;
    });
  }

  @action.bound
  setThreadSummaries(paginationResult: PaginationResult<IDiscussionPost>) {
    paginationResult.results.forEach(postJson => {
      this.threadSummariesMap.set(postJson.discussionId, this.parseJsonTree(postJson));
    });
    this.threadSummariesHasMore = paginationResult.hasNextPage;
    this.threadSummariesNextStart = paginationResult.nextStart;
  }

  @computed
  get threadSummaries(): DiscussionPost[] {
    return Array.from(this.threadSummariesMap.values());
  }

  @action.bound
  async createThread(post: NewPostPayload): Promise<DiscussionPost> {
    try {
      let threadRoot: DiscussionPost = new DiscussionPost(await DiscussionService.createPost(post));
      runInAction(() => {
        this.threadSummariesMap.set(threadRoot.discussionId, threadRoot);
      });
      return new DiscussionPost(threadRoot);
    } catch (e) {
      alert(e.message);
    }
  }

  @action.bound
  updateCommentCount(reply: DiscussionPost): void {
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
  }

  @action.bound
  private parseJsonTree(postJson: IDiscussionPost): DiscussionPost {
    let repliesJson: IDiscussionPost[] = postJson.replies || [];
    let replies: DiscussionPost[] = repliesJson.map(post => this.parseJsonTree(post));
    let post = new DiscussionPost({ ...postJson, ...{ replies } });
    return post;
  }
}
