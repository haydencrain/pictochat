import { IDiscussionPost } from '../models/store/DiscussionPost';
/**
 * A React Hook that provides functionality for fetching, deleting and unflagging reports
 * @function
 */
export declare function useFetchReports(): {
    /**
     * The list of reported posts
     */
    reports: IDiscussionPost[];
    /**
     * Whether the hook is currently fetching reports
     */
    isLoading: boolean;
    /**
     * A function which connects to the Content Report Service, and unflags a report
     * @function
     * @param { string } postId - the id of the post to unflag
     */
    unflagReport: (postId: string) => Promise<void>;
    /**
     * A function which connects to the Discussion Service, and deletes a post
     * @function
     * @param { string } postId - the id of the post to delete
     */
    deleteReport: (postId: string) => Promise<void>;
};
