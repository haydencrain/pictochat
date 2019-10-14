/// <reference types="react" />
import { User } from '../../../models/store/User';
import './ProfileCard.less';
interface LoginProps {
    /**
     * The user to display within the card
     */
    user: User;
    /**
     * Set true to render a list of links, such as logout and view profile
     */
    isCurrentUser?: boolean;
    /**
     * Callback function that executes when the logout link is clicked
     * @function
     */
    onLogoutClick?: () => void;
}
/**
 * A React component that displays a user profile in a card UI layout
 * @param { LoginProps } props - The props of the component
 */
declare function ProfileCard(props: LoginProps): JSX.Element;
declare const _default: typeof ProfileCard;
export default _default;
