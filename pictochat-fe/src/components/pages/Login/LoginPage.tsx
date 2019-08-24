import * as React from 'react';

import Login from '../../common/Login';
import './LoginPage.less';

interface LoginPage {}

export default (props: LoginPage) => {
  return (
    <section id="login-page">
      <Login />
    </section>
  );
};
