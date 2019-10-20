/// <reference types="react" />
import './PostMainContainer.less';
interface PostMainContainerProps {
    /**
     * The id of the post to use
     */
    id: string;
}
/**
 * A React component that connects to mobx, and displays the current active discussion post as the main post
 * @param { PostMainContainerProps } props - The props of the component
 */
declare function PostMainContainer(props: PostMainContainerProps): JSX.Element;
declare const _default: typeof PostMainContainer;
export default _default;
