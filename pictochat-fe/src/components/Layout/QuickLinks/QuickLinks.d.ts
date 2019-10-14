import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import './QuickLinks.less';
/**
 * React component that supplies links to important routes within the application
 * @component
 * @param props (RouteComponentProps)
 */
declare function QuickLinks(props: RouteComponentProps<{}>): JSX.Element;
declare const _default: React.ComponentClass<Pick<RouteComponentProps<{}, import("react-router").StaticContext, any>, never>, any> & import("react-router").WithRouterStatics<typeof QuickLinks>;
export default _default;
