import { observable, computed, action, runInAction, ObservableMap } from 'mobx';
import { DiscussionPost, IDiscussionPost } from '../models/store/DiscussionPost';
import DiscussionService from '../services/DiscussionService';
import NewPostPayload from '../models/NewPostPayload';
import PaginationResult from '../models/PaginationResult';
import { SortTypes, SortValue } from '../models/SortTypes';
import config from '../config';

interface IDiscussionStore {
  /**
   * The currently active sort for the active discussion list
   */
  sort: SortValue;
  /**
   * Whether there is still more discussions to load
   */
  hasMore: boolean;
  /**
   * The index to next start the fetching of discussions from
   */
  nextStart: number;
  /**
   * A map which stores of all of the currently fetched discussions
   */
  discussionsMap: ObservableMap<any, DiscussionPost>;
  /**
   * Set to true if the store is currently performing an API request to fetch or update discussion data
   */
  isLoading: boolean;
}

const { PAGINATION_LIMIT } = config.discussion;

/**
 * Creates an observable instance which coordinates updates to discussion data
 * @class
 */
export default class DiscussionStore implements IDiscussionStore {
  @observable sort: SortValue = SortTypes.NEW;
  @observable hasMore = true;
  @observable nextStart = 0;
  @observable discussionsMap: ObservableMap<any, DiscussionPost> = observable.map(undefined, {
    name: 'discussionsMap'
  });
  @observable isLoading = false;

  /**
   * Sets the currently active sort, and then re-fetches the discussion
   * @function
   * @param sort - The new sort to use
   */
  @action.bound
  setSort(sort: SortValue) {
    this.sort = sort;
    this.getNewDiscussions();
  }

  /**
   * Fetches a new list of discussions
   * @function
   */
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

  /**
   * Uses the `nextStart` field to fetch more discussions after a specific index
   * @function
   */
  @action.bound
  async getMoreDiscussions() {
    this.isLoading = true;
    const paginationResult = await DiscussionService.getDiscussions(this.sort, PAGINATION_LIMIT, this.nextStart);
    runInAction(() => {
      this.setDiscussions(paginationResult);
      this.isLoading = false;
    });
  }

  /**
   * Adds the fetch discussions result to update the store's fields and discussion map
   * @param paginationResult - The result retrieved from the api
   */
  @action.bound
  setDiscussions(paginationResult: PaginationResult<IDiscussionPost>) {
    paginationResult.results.forEach(postJson => {
      this.discussionsMap.set(postJson.discussionId, this.parseJsonTree(postJson));
    });
    this.hasMore = paginationResult.hasNextPage;
    this.nextStart = paginationResult.nextStart;
  }

  /**
   * Gets the current discussions list
   * @function
   * @returns An array of Discussions from the map
   */
  @computed
  get discussions(): DiscussionPost[] {
    return Array.from(this.discussionsMap.values());
  }

  /**
   * Creates a new Discussion Post
   * @param post The new post to create a discussion for
   */
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

  /**
   * Increments the comment count if the discussion is present in the map
   * @param reply - The post to update the count for
   */
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
