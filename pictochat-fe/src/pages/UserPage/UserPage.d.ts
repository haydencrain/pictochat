/// <reference types="react" />
import { RouteComponentProps } from 'react-router';
import './UserPage.less';
interface UserPageMatchParams {
    /**
     * The username of the user that has been retrieved from route parameters
     */
    username: string;
}
interface UserPageProps extends RouteComponentProps<UserPageMatchParams> {
}
/**
 * A React component used to fetch the user specified by the route parameters, and display their profile card.
 * @param { UserPageProps } props - The props of the component
 */
declare function UserPage(props: UserPageProps): JSX.Element;
declare const _default: typeof UserPage;
export default _default;
