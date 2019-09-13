import * as React from 'react';
import './RegisterPage.less';
import SignUp from '../../components/SignUp';
interface RegisterPage { }

export default (props: RegisterPage) => {
  return <section id="register-page">
    <SignUp />
  </section>;
};
