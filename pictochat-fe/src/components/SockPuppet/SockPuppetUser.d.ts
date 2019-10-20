/// <reference types="react" />
import User from '../../models/store/User';
interface SockPuppetUserProps {
    /**
     * The suspicious user
     */
    user: User;
}
/**
 * A React component that displays details of the suspicious user, with a button to be able to disable their account
 * @component
 */
declare function SockPuppetUser(props: SockPuppetUserProps): JSX.Element;
declare const _default: typeof SockPuppetUser;
export default _default;
