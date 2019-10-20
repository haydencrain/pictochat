import ObservableIntMap from '../utils/ObserableIntMap';
import { DiscussionPost } from '../models/store/DiscussionPost';
import NewPostPayload from '../models/NewPostPayload';
import { SortValue } from '../models/SortTypes';
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
/**
 * Creates an observable instance that coordinates updates to discussion data.
 * For example, When a user access a route such as `/dicussion/23`, it will handle fetching the discussion postwith an id of '23',
 * and also fetch its replies
 * @class
 */
export default class ActiveDiscussionStore implements IActiveDiscussionStore {
    discussionStore: DiscussionStore;
    sort: SortValue;
    postId: string;
    discussion: DiscussionPost;
    postsMap: ObservableIntMap<DiscussionPost>;
    isLoadingRoot: boolean;
    isLoadingReplies: boolean;
    constructor(discussionStore: DiscussionStore);
    /**
     * Sets the currently active sort, and then re-fetches the replies list
     * @function
     * @param sort - The new sort to use
     */
    setSort(sort: SortValue): void;
    /**
     * Sets a new active discussion
     * @tunction
     * @param postId - The id of the new post
     */
    setDiscussion(postId: string): Promise<void>;
    /**
     * Fetches a new replies list
     * @function
     * @param postId - The id of the post to fetch the replies from
     */
    getNewReplies(postId: string): Promise<void>;
    /**
     * Gets more replies
     * @function
     * @param parentPostId - The id of the post fetch the replies from
     * @param after - The post id where the extra replies should start from
     */
    getExtraReplies(parentPostId: string, after?: string): Promise<void>;
    /**
     * Deletes a post
     * @function
     * @param postId - The id of the post to delete
     */
    deletePost(postId: number): Promise<void>;
    /**
     * Updates a Post with a new image
     * @function
     * @param postId - The id of the post to update
     * @param image - The image file to update the post with
     */
    updatePostImage(postId: number, image: File): Promise<void>;
    /**
     * Creates a new reply, and adds it to the map
     * @function
     * @param post - The mew post to create
     */
    createReply(post: NewPostPayload): Promise<DiscussionPost>;
    private parseJsonTree;
    private putPostInActiveMap;
}
export {};
