/// <reference types="react" />
import { RouteComponentProps } from 'react-router';
import './RegisterPage.less';
interface RegisterPageProps extends RouteComponentProps<any> {
}
/**
 * A React component that renders the Registration Page, which includes the register form.
 * @param props - The props of the component (includes RouteComponentProps in order to access the route history)
 */
export default function RegisterPage(props: RegisterPageProps): JSX.Element;
export {};
