/// <reference types="react" />
interface ThreadsSummaryListProps {
    /**
     * Set true if the replies of each reply should be displayed (aka display the reply tree)
     */
    showReplies: boolean;
    /**
     * Message to be displayed when no posts are passed into the component
     */
    noPostsMessage: string;
    /**
     * Set to true if the segment containing the posts list should be raised
     */
    raised: boolean;
}
/**
 * A React component that fetches the main discussion posts, and passes the data into the PostsLists component
 * @param { ThreadsSummaryListProps } props - The props of the component
 */
declare function ThreadsSummaryList(props: ThreadsSummaryListProps): JSX.Element;
declare const _default: typeof ThreadsSummaryList;
export default _default;
