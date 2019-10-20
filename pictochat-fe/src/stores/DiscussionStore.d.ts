import { ObservableMap } from 'mobx';
import { DiscussionPost, IDiscussionPost } from '../models/store/DiscussionPost';
import NewPostPayload from '../models/NewPostPayload';
import PaginationResult from '../models/PaginationResult';
import { SortValue } from '../models/SortTypes';
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
/**
 * Creates an observable instance which coordinates updates to discussion data
 * @class
 */
export default class DiscussionStore implements IDiscussionStore {
    sort: SortValue;
    hasMore: boolean;
    nextStart: number;
    discussionsMap: ObservableMap<any, DiscussionPost>;
    isLoading: boolean;
    /**
     * Sets the currently active sort, and then re-fetches the discussion
     * @function
     * @param sort - The new sort to use
     */
    setSort(sort: SortValue): void;
    /**
     * Fetches a new list of discussions
     * @function
     */
    getNewDiscussions(): Promise<void>;
    /**
     * Uses the `nextStart` field to fetch more discussions after a specific index
     * @function
     */
    getMoreDiscussions(): Promise<void>;
    /**
     * Adds the fetch discussions result to update the store's fields and discussion map
     * @param paginationResult - The result retrieved from the api
     */
    setDiscussions(paginationResult: PaginationResult<IDiscussionPost>): void;
    /**
     * Gets the current discussions list
     * @function
     * @returns An array of Discussions from the map
     */
    readonly discussions: DiscussionPost[];
    /**
     * Creates a new Discussion Post
     * @param post The new post to create a discussion for
     */
    createDiscussion(post: NewPostPayload): Promise<DiscussionPost>;
    /**
     * Increments the comment count if the discussion is present in the map
     * @param reply - The post to update the count for
     */
    updateCommentCount(reply: DiscussionPost): void;
    private parseJsonTree;
}
export {};
