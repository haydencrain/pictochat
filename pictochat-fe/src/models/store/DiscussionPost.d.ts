import { PostAuthor, IPostAuthor } from './PostAuthor';
import { IObservableArray } from 'mobx';
export interface IDiscussionPost {
    /**
     * The id of the post
     */
    postId: string;
    /**
     * The id of the parent post (if it's a reply)
     */
    parentPostId: string;
    /**
     * The post's discussion id
     */
    discussionId: string;
    /**
     * if the post is a discussion post, then it will be true
     */
    isRootPost: boolean;
    /**
     * The author of the post
     */
    author: PostAuthor;
    /**
     * The url (or base64 string) of the post's image
     */
    imageSrc: string;
    /**
     * The date the post was submitted
     */
    postedDate: string;
    /**
     * Will be set to true if the post has been deleted
     */
    isHidden: boolean;
    /**
     * The number of reactions the post has
     */
    reactionsCount: number;
    /**
     * The number of comments the post has. (NOTE: This will only appear on discussion posts, and will be `null` for reply posts).
     */
    commentCount?: number;
    /**
     * The posts that have replied to the post (if any). NOTE: if `hasMore` is `true`, then this array does not contain
     * the entire list of replies yet
     */
    replies?: IDiscussionPost[];
    /**
     * If set to true, the post has more replies to fetch from the back end.
     */
    hasMore?: boolean;
}
/**
 * Creates an mobx ovservable instance of a DiscussionPost, and provides extra methods for
 * handling CRUD updates.
 * @class
 */
export declare class DiscussionPost implements IDiscussionPost {
    postId: string;
    parentPostId: string;
    discussionId: string;
    isRootPost: boolean;
    author: IPostAuthor;
    imageSrc: string;
    postedDate: string;
    isHidden: boolean;
    reactionsCount: number;
    commentCount?: number;
    replies?: IObservableArray<DiscussionPost>;
    hasMore?: boolean;
    constructor(data?: IDiscussionPost);
    /**
     * Removes a reply from the post's `replies` array
     * @function
     * @param { DiscussionPost } reply - The reply to remove
     */
    removeReply(reply: DiscussionPost): void;
    /**
     * Adds more replies to the post's replies array
     * @function
     * @param { DiscussionPost[] } replies - The array of replies to add
     */
    addReplies(replies: DiscussionPost[]): void;
    /**
     * Replaces this instance's post with another instance of a post
     * @function
     * @param { DiscussionPost } other - The post to replace this instance with
     */
    replace(other: DiscussionPost): void;
    /**
     * Replaces this instance's post with an empty post
     * @function
     */
    clear(): void;
    /**
     * Creates a new instance from a JSON representation of this class
     * @param { IDiscussionPost } post - A JSON representation of this class
     * @returns A new instance of DiscussionPost
     */
    static fromJSON(post: IDiscussionPost): DiscussionPost;
}
