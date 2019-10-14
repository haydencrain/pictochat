/// <reference types="react" />
import './LoginForm.less';
interface LoginFormProps {
    /**
     * Set true to render the Segment in a loading state
     */
    isLoading: boolean;
    /**
     * Callback function that fires when the User has logged in successfully
     */
    onLogin?: () => Promise<void>;
}
/**
 * A React component that Provides a form to login a user
 * @param { LoginFormProps } props - The props of the component
 */
declare function LoginForm(props: LoginFormProps): JSX.Element;
declare const _default: typeof LoginForm;
export default _default;
