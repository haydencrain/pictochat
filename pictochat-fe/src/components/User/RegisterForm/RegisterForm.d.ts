/// <reference types="react" />
import './RegisterForm.less';
interface RegisterFormProps {
    /**
     * Callback function that executes when the cancel button is clicked
     * @function
     */
    onCancelClick?: () => void;
    /**
     * Callback function that executes when a user has registered successfully
     * @function
     */
    onSubmitSuccess?: () => void;
}
/**
 * A React component that Provides a form to register a user
 * @param { RegisterFormProps } props - The props of the component
 */
export declare function RegisterForm(props: RegisterFormProps): JSX.Element;
declare const _default: typeof RegisterForm;
export default _default;
