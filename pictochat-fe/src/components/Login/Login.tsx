import * as React from 'react';
import { Link } from 'react-router-dom';
import { Container, Form, Button } from 'semantic-ui-react';
import StoresContext from '../../contexts/StoresContext';
import UnauthenticatedUser from '../../models/UnauthenticatedUser';
import './Login.less';

interface LoginState {
  email: string;
  password: string;
}

class Login extends React.Component<{}, LoginState> {
  static contextType = StoresContext;

  constructor(props: any) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  handleEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ email: event.target.value });
  }

  handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ password: event.target.value });
  }

  async handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    try {
      event.preventDefault();
      const user: UnauthenticatedUser = {
        // TODO: 'email' field should be 'username'!!!
        username: '',
        email: this.state.email,
        password: this.state.password
      };
      await this.context.user.authAndLoadCurrentUser(user);
    } catch (error) {
      alert(error);
    }
  }

  render() {
    return (
      <Form id="login-form" className="ui raised segment" onSubmit={this.handleSubmit} method="POST">
        <Form.Field className="login-field">
          <label>Username or Email</label>
          <input type="text" placeholder="username" value={this.state.email} onChange={this.handleEmailChange} />
        </Form.Field>
        <Form.Field className="login-field">
          <label>Password</label>
          <input type="password" value={this.state.password} onChange={this.handlePasswordChange} />
        </Form.Field>
        <Form.Group widths="equal">
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
}

export default Login;
