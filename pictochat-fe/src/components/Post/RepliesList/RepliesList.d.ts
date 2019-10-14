/// <reference types="react" />
interface RepliesListProps {
    /**
     * The id of the post to get the replies from
     */
    postId: string;
    /**
     * Set true if the replies of each reply should be displayed (aka display the reply tree)
     */
    showReplies: boolean;
    /**
     * Message to be displayed when no posts are passed into the component
     */
    noPostsMessage?: string;
    /**
     * Set to true if the segment containing the posts list should be raised
     */
    raised: boolean;
}
/**
 * A React component that fetches the replies of a post, and passes the data into the PostsLists component
 * @param { RepliesListProps } props - The props of the component
 */
declare function RepliesList(props: RepliesListProps): JSX.Element;
declare const _default: typeof RepliesList;
export default _default;
