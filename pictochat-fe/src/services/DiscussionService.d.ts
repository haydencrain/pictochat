import { IDiscussionPost } from '../models/store/DiscussionPost';
import NewPostPayload from '../models/NewPostPayload';
import PaginationResult from '../models/PaginationResult';
import { SortValue } from '../models/SortTypes';
/**
 * Implements HTTP Requests for the `'/discussion'` API endpoint
 * @class
 * @static
 */
export declare class DiscussionService {
    static getDiscussions(sort: SortValue, limit?: number, start?: number): Promise<PaginationResult<IDiscussionPost>>;
    static getPost(postId: string, sort: SortValue, limit?: number, after?: string): Promise<IDiscussionPost>;
    static getPostReplies(discussionId: string, sort: SortValue): Promise<IDiscussionPost[]>;
    static createPost(post: NewPostPayload): Promise<IDiscussionPost>;
    static updatePost(data: {
        postId: number;
        image: File;
    }): Promise<IDiscussionPost>;
    static deletePost(postId: number | string): Promise<IDiscussionPost>;
}
export default DiscussionService;
