import * as React from 'react';
import { Link } from 'react-router-dom';
import { Form, Button } from 'semantic-ui-react';
import UnauthenticatedUser from '../../../models/UnauthenticatedUser';
import StoresContext from '../../../contexts/StoresContext';
import { observer } from 'mobx-react';
import useForm from 'react-hook-form';
import './LoginForm.less';

interface LoginFormProps {
  isLoading: boolean;
  onLogin?: () => Promise<void>;
}

type LoginFormData = {
  username: string;
  password: string;
};

function LoginForm(props: LoginFormProps) {
  const userStore = React.useContext(StoresContext).user;
  const { handleSubmit, register } = useForm<LoginFormData>();

  const onSubmit = handleSubmit(async ({ username, password }) => {
    console.log(username, password);
    try {
      const user: UnauthenticatedUser = {
        username: username,
        email: '',
        password: password
      };
      await userStore.authAndLoadCurrentUser(user);
      props.onLogin && props.onLogin();
    } catch (error) {
      alert(error);
    }
  });

  return (
    <Form id="login-form" className="ui raised segment" onSubmit={onSubmit} method="POST" loading={props.isLoading}>
      <Form.Field className="login-field">
        <label>Username</label>
        <input name="username" type="text" ref={register} />
      </Form.Field>
      <Form.Field className="login-field">
        <label>Password</label>
        <input name="password" type="password" ref={register} />
      </Form.Field>
      <Form.Group inline>
        <Form.Field>
          <Button primary className="login-button">
            Log in
          </Button>
        </Form.Field>
        <Form.Field className="membership-field">
          <p className="membership">Not a member?</p>
          <Link to="/register">Create an Account</Link>
        </Form.Field>
      </Form.Group>
    </Form>
  );
}

export default observer(LoginForm);
