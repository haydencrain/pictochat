/// <reference types="react" />
import './ReactionsContainer.less';
interface ReactionsProps {
    /**
     * The id of the post the reactions belong to
     */
    postId: string;
    /**
     * Set to false if the reactions for this post should be loaded
     */
    shouldLoad?: boolean;
}
/**
 * A React component that fetches and displays the reactions of a post, and also handles passes CRUD operations to
 * the reactions store.
 * @param { ReactionsProps } props - The props of the component
 */
declare function ReactionsContainer(props: ReactionsProps): JSX.Element;
declare const _default: typeof ReactionsContainer;
export default _default;
