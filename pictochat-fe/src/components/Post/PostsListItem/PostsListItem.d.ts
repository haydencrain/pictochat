/// <reference types="react" />
import { DiscussionPost } from '../../../models/store/DiscussionPost';
import { PostTypes } from '../../../models/PostTypes';
import './PostsListItem.less';
interface PostListItemProps {
    /**
     * The post to display
     */
    post: DiscussionPost;
    /**
     * The type of post to display (Main, Root, or Reply)
     */
    postType: PostTypes;
    /**
     * Set to true if each post should display its replies (aka display the reply tree)
     */
    showReplies: boolean;
}
/**
 * A React component that renders a list item for the PostsList component
 * @param { PostListsProps } props - The props of the component
 */
declare function PostsListItem(props: PostListItemProps): JSX.Element;
export default PostsListItem;
