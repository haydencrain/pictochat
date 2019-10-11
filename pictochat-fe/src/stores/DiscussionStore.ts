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
  @observable sort: SortValue = SortTypes.NEW;
  @observable hasMore = true;
  @observable nextStart = 0;
  @observable discussionsMap: ObservableMap<any, DiscussionPost> = observable.map(undefined, {
    name: 'discussionsMap'
  });
  @observable isLoading = false;

  @action.bound
  setSort(sort: SortValue) {
    this.sort = sort;
    this.getNewDiscussions();
  }

  @action.bound
  async getNewDiscussions() {
    this.isLoading = true;
    this.discussionsMap.clear();
    this.nextStart = 0;
    this.hasMore = true;
    const paginationResult = await DiscussionService.getDiscussions(this.sort, PAGINATION_LIMIT);
    // Mobx @action will only track changes up to the first use of await in an an async function
    // so we need to run the rest in runInAction() to ensure anything observing the modified obserables
    // isLoadingReplies updated
    runInAction(() => {
      this.setDiscussions(paginationResult);
      this.isLoading = false;
    });
  }

  @action.bound
  async getMoreDiscussions() {
    this.isLoading = true;
    const paginationResult = await DiscussionService.getDiscussions(this.sort, PAGINATION_LIMIT, this.nextStart);
    runInAction(() => {
      this.setDiscussions(paginationResult);
      this.isLoading = false;
    });
  }

  @action.bound
  setDiscussions(paginationResult: PaginationResult<IDiscussionPost>) {
    paginationResult.results.forEach(postJson => {
      this.discussionsMap.set(postJson.discussionId, this.parseJsonTree(postJson));
    });
    this.hasMore = paginationResult.hasNextPage;
    this.nextStart = paginationResult.nextStart;
  }

  @computed
  get discussions(): DiscussionPost[] {
    return Array.from(this.discussionsMap.values());
  }

  @action.bound
  async createDiscussion(post: NewPostPayload): Promise<DiscussionPost> {
    try {
      let threadRoot: DiscussionPost = new DiscussionPost(await DiscussionService.createPost(post));
      runInAction(() => {
        this.discussionsMap.set(threadRoot.discussionId, threadRoot);
      });
      return new DiscussionPost(threadRoot);
    } catch (e) {
      alert(e.message);
    }
  }

  @action.bound
  updateCommentCount(reply: DiscussionPost): void {
    // Update thread summary
    if (this.discussionsMap.has(reply.discussionId)) {
      // Use of parseInt here fixes weird bug where mobx converts commentCount to string
      let commentCount = parseInt(this.discussionsMap.get(reply.discussionId).commentCount as any) + 1;
      this.discussionsMap.get(reply.discussionId).commentCount = commentCount;
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
