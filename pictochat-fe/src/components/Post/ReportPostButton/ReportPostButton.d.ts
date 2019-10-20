import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import './ReportPostButton.less';
interface ReportPostButtonProps extends RouteComponentProps<any> {
    /**
     * the id of the post to report
     */
    postId: string;
}
/**
 * React component (a button) that will report a post on click
 * @param { ReportPostButtonProps } props - The props of the component
 */
declare function ReportPostButton(props: ReportPostButtonProps): JSX.Element;
declare const _default: React.ComponentClass<Pick<ReportPostButtonProps, "postId">, any> & import("react-router").WithRouterStatics<typeof ReportPostButton>;
export default _default;
