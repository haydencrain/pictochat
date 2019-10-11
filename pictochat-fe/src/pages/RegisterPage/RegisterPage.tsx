import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import RegisterForm from '../../components/User/RegisterForm';
import './RegisterPage.less';

interface RegisterPageProps extends RouteComponentProps<any> {}

/**
 * A React component that renders the Registration Page, which includes the register form.
 * @param props - The props of the component (includes RouteComponentProps in order to access the route history)
 */
export default function RegisterPage(props: RegisterPageProps) {
  const handleCancelClick = React.useCallback(() => {
    props.history.goBack();
  }, []);

  const handleSubmitSuccess = React.useCallback(() => {
    props.history.goBack();
  }, []);

  return (
    <section id="register-page">
      <RegisterForm onCancelClick={handleCancelClick} onSubmitSuccess={handleSubmitSuccess} />
    </section>
  );
}
