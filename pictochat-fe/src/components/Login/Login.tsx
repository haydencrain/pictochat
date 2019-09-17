import * as React from 'react';
import { Container, Header, Form, Button } from 'semantic-ui-react';
import UserService from '../../services/UserService';
import './Login.less';
import { User } from '../../models/User';

interface LoginState {
  email: string;
  password: string;
}

class Login extends React.Component<{}, LoginState> {
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
    console.log(event.target.value);
    this.setState({ email: event.target.value });
  }

  handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
    console.log(event.target.value);
    this.setState({ password: event.target.value });
  }

  async handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const user: User = {
      // TODO: 'email' field should be 'username'!!!
      username: '',
      email: this.state.email,
      password: this.state.password
    };
    const res = await UserService.authUser(user);
    alert(res);
    // FIXME: don't hard refresh the window. rather we should be refecthing the user from the UserStore
    window.location.reload();
  }

  render() {
    return (
      <Container id="login-container">
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
              <a>Create an Account</a>
            </Form.Field>
          </Form.Group>
        </Form>
      </Container>
    );
  }
}

export default Login;
