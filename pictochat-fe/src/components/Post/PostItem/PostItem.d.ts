import * as React from 'react';
import { DiscussionPost } from '../../../models/store/DiscussionPost';
import { PostTypes } from '../../../models/PostTypes';
import { RouteComponentProps } from 'react-router-dom';
import './PostItem.less';
interface PostItemProps extends RouteComponentProps<any> {
    /**
     * The post to display
     */
    post: DiscussionPost;
    /**
     * The type of post to display (Main, Root, or Reply)
     */
    postType?: PostTypes;
}
/**
 * A React Component that encapsulates the post. Displays the post, the author, its reactions, as well as
 * functionality links specific to the post.
 * @param { PostItemProps } props - The props of the component
 */
declare function PostItem(props: PostItemProps): JSX.Element;
declare const _default: React.ComponentClass<Pick<PostItemProps, "post" | "postType">, any> & import("react-router").WithRouterStatics<typeof PostItem>;
export default _default;
