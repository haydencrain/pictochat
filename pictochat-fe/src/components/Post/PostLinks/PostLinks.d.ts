/// <reference types="react" />
import { PostTypes } from '../../../models/PostTypes';
import { DiscussionPost } from '../../../models/store/DiscussionPost';
import './PostLinks.less';
interface PostLinksProps {
    /**
     * The post to display
     */
    post: DiscussionPost;
    /**
     * The type of post to display (Main, Root, or Reply)
     */
    postType: PostTypes;
}
/**
 * A React component that provides functional links for a component, depending on the type of post it's for
 * @param { PostLinksProps } props - The props of the component
 */
declare function PostLinks(props: PostLinksProps): JSX.Element;
declare const _default: typeof PostLinks;
export default _default;
