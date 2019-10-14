/// <reference types="react" />
import './ThreadListContainer.less';
interface ThreadListContainerProps {
    /**
     * The post id of for the thread list. If no id is present, then it's the main threads, otherwise it's the replies
     */
    id?: string;
    /**
     * The header to display within the section
     */
    sectionHeader: string;
    /**
     * The message to display if no posts are present
     */
    noPostsMessage?: string;
    /**
     * The text of the button that is Present within the menu, which is used to create a new post
     */
    addPostButtonMessage?: string;
    /**
     * Set true if the replies of each reply should be displayed (aka display the reply tree)
     */
    showReplies?: boolean;
}
/**
 * A React component that provides a section for loading, display and sorting a list of threads (posts). This component
 * can be used for either displaying the Main threads, or to display a thread's replies.
 * @param { ThreadListContainerProps } props - The props of the component
 */
declare function ThreadListContainer(props: ThreadListContainerProps): JSX.Element;
declare const _default: typeof ThreadListContainer;
export default _default;
