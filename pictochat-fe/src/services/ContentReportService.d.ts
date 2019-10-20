import { IDiscussionPost } from '../models/store/DiscussionPost';
/**
 * Implements HTTP Requests for the `'/content-report'` API endpoint
 * @class
 * @static
 */
export declare class ContentReportService {
    static getContentReports(): Promise<IDiscussionPost[]>;
    static reportPost(postId: string | number): Promise<void>;
    static unflagReportedPost(postId: string): Promise<{
        postId: any;
        hasInappropriateContentFlag: any;
    }>;
}
export default ContentReportService;
