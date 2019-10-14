/// <reference types="react" />
import { IDiscussionPost } from '../../models/store/DiscussionPost';
interface ReportPostsProps {
    /**
     * A list of reported posts
     */
    reports: IDiscussionPost[];
    /**
     * A callback function that is executed when an action to delete a post is performed
     * @function
     * @param { string } postId - The id of the 'to be deleted' post
     */
    onDeleteClick: (postId: string) => void;
    /**
     * A callback function that is executed when an action to unflag a post is performed
     * @function
     * @param { string } postId - The id of the 'to be unflagged' post
     */
    onUnflagClick: (postId: string) => void;
}
/**
 * A React component that displays a list of Report Posts
 * @component
 * @param { ReportPostsProps } props - The props of the component
 */
declare function ReportPosts(props: ReportPostsProps): JSX.Element;
export default ReportPosts;
