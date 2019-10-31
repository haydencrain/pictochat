import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import './DiscussionPage.less';
export declare const REPLY_PLACEHOLDER_TEXT = "No replies have been added yet! Be the first to add a reply!";
interface DiscussionPageMatchParams {
    /**
     * The id of the discussion, from the url route params
     */
    id: string;
}
interface DiscussionPageProps extends RouteComponentProps<DiscussionPageMatchParams> {
}
/**
 * A React component that fetches the currently selected discussion (by access the url's route parameters) and rendering
 * Page layout for the discussion
 * @component
 * @param { DiscussionPageProps } props - The props of the component
 */
declare function DiscussionPage(props: DiscussionPageProps): JSX.Element;
declare const _default: React.ComponentClass<Pick<DiscussionPageProps, never>, any> & import("react-router").WithRouterStatics<typeof DiscussionPage>;
export default _default;
