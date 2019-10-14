/// <reference types="react" />
import { DiscussionPost } from '../../../models/store/DiscussionPost';
import { PostTypes } from '../../../models/PostTypes';
import './PostsList.less';
interface PostListsProps {
    /**
     * The posts to display
     */
    posts: DiscussionPost[];
    /**
     * The type of the posts (Main, Root, or Reply)
     */
    postsType: PostTypes;
    /**
     * Message to be displayed when no posts are passed into the component
     */
    noPostsMessage?: string;
    /**
     * Component will display a loader if set to true
     */
    isLoading?: boolean;
    /**
     * Set to true if each post should display its replies (aka display the reply tree)
     */
    showReplies: boolean;
    /**
     * Set to true if the segment containing the posts list should be raised
     */
    raised: boolean;
    /**
     * Set to true to display a 'Load More...' component at the end of segment
     */
    shouldLoadMore?: boolean;
    /**
     * Callback function that is executed when the 'Load More...' segment is pressed
     * @function
     */
    onLoadMore?: () => void;
}
/**
 * A React component that renders a segmented list of posts
 * @param { PostListsProps } props - The props of the component
 */
declare function PostsList(props: PostListsProps): JSX.Element;
export default PostsList;
