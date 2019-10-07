import * as React from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Segment, Loader } from 'semantic-ui-react';
import UnauthenticatedUser from '../../models/UnauthenticatedUser';
import StoresContext from '../../contexts/StoresContext';
import './Login.less';

interface LoginState {
  email: string;
  password: string;
}

interface LoginProps {
  isLoading: boolean;
  onLogin?: () => Promise<void>;
}

class Login extends React.Component<LoginProps, LoginState> {
  static contextType = StoresContext;

  constructor(props: LoginProps) {
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

      if (this.props.onLogin) {
        await this.props.onLogin();
      }
    } catch (error) {
      alert(error);
    }
  }

  render() {
    if (this.props.isLoading) {
      return (
        <Segment>
          <Loader active />
        </Segment>
      );
    }
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
}

export default Login;
