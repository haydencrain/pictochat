import * as React from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Segment, Loader } from 'semantic-ui-react';
import UnauthenticatedUser from '../../../models/UnauthenticatedUser';
import StoresContext from '../../../contexts/StoresContext';
import './LoginForm.less';
import { observer } from 'mobx-react';
import { useLoginForm } from '../../../hooks/FormHooks';

interface LoginFormProps {
  isLoading: boolean;
  onLogin?: () => Promise<void>;
}

function LoginForm(props: LoginFormProps) {
  const userStore = React.useContext(StoresContext).user;
  const { username, password, setFormField, clearForm } = useLoginForm();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      const user: UnauthenticatedUser = {
        // TODO: 'email' field should be 'username'!!!
        username: username,
        email: '',
        password: password
      };
      await userStore.authAndLoadCurrentUser(user);
      props.onLogin && props.onLogin();
    } catch (error) {
      alert(error);
    }
  };

  if (props.isLoading) {
    return (
      <Segment>
        <Loader active />
      </Segment>
    );
  }

  return (
    <Form id="login-form" className="ui raised segment" onSubmit={handleSubmit} method="POST">
      <Form.Field className="login-field">
        <label>Username or Email</label>
        <input name="username" type="text" placeholder="username" value={username} onChange={setFormField} />
      </Form.Field>
      <Form.Field className="login-field">
        <label>Password</label>
        <input name="password" type="password" value={password} onChange={setFormField} />
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
