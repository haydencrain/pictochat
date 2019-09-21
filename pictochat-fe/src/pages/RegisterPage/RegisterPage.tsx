import * as React from 'react';
import RegisterForm from '../../components/RegisterForm';
import './RegisterPage.less';
import { RouteComponentProps } from 'react-router';

interface RegisterPageProps extends RouteComponentProps<any> { }

export default function RegisterPage(props: RegisterPageProps) {
  const handleCancelClick = React.useCallback(() => {
    props.history.goBack();
  }, []);

  const handleSubmitSuccess = React.useCallback(() => {
    console.log(props.history);
    props.history.goBack();
  }, []);

  return (
    <section id="register-page">
      <RegisterForm onCancelClick={handleCancelClick} onSubmitSuccess={handleSubmitSuccess} />
    </section>
  );
}
