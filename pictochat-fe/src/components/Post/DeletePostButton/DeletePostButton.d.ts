import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import './DeletePostButton.less';
interface DeletePostButtonProps extends RouteComponentProps<any> {
    /**
     * The id of the post to delete (once the button is pressed)
     */
    postId: string;
}
/**
 * React component that provides a button that will delete a post on click
 * @param { DeletePostButtonProps } props - The props of the component
 */
declare function DeletePostButton(props: DeletePostButtonProps): JSX.Element;
declare const _default: React.ComponentClass<Pick<DeletePostButtonProps, "postId">, any> & import("react-router").WithRouterStatics<typeof DeletePostButton>;
export default _default;
