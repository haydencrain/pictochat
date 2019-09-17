import * as React from 'react';
import { Container, Header, Form, Button, Divider } from 'semantic-ui-react';
import UserService from '../../services/UserService';
import { User } from '../../models/User';
import './Signup.less';

interface SignUpState {
  username: string;
  email: string;
  password: string;
  retryPwd: string;
}

class SignUp extends React.Component<{}, SignUpState> {
  constructor(props: any) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: '',
      retryPwd: ''
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleRetryPwdChange = this.handleRetryPwdChange.bind(this);
    this.handleCancelClick = this.handleCancelClick.bind(this);
  }

  handleUsernameChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ username: event.target.value });
  }

  handleEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ email: event.target.value });
  }

  handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ password: event.target.value });
  }

  handleRetryPwdChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ retryPwd: event.target.value });
  }

  handleCancelClick(event: React.SyntheticEvent<any>) {
    event.preventDefault();
    this.clearForm();
  }

  clearForm = () => {
    this.setState({
      username: '',
      email: '',
      password: '',
      retryPwd: ''
    });
  };

  async handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const user: User = {
      username: this.state.username,
      email: this.state.email,
      password: this.state.password
    };
    console.log(user);
    const res = await UserService.addUser(user);
    console.log(res);
  }

  render() {
    return (
      <Form id="register-form" onSubmit={this.handleSubmit} method="POST">
        <h1>Create an Account</h1>
        <Form.Field className="register-field-username">
          <label>Username</label>
          <input name="username" type="text" value={this.state.username} onChange={this.handleUsernameChange} />
        </Form.Field>
        <Form.Field className="register-field-email">
          <label>Email</label>
          <input name="email" type="text" value={this.state.email} onChange={this.handleEmailChange} />
        </Form.Field>
        <Form.Field className="register-field-password">
          <label>Password</label>
          <input name="password" type="password" value={this.state.password} onChange={this.handlePasswordChange} />
        </Form.Field>
        <Form.Field className="register-field-retry-password">
          <label>Re-type Password</label>
          <input
            name="retryPassword"
            type="password"
            value={this.state.retryPwd}
            onChange={this.handleRetryPwdChange}
          />
        </Form.Field>
        <Form.Group className="register-actions">
          <Form.Field className="cancel-button">
            <Button onClick={this.handleCancelClick}>Cancel</Button>
          </Form.Field>
          <Form.Field className="register-button">
            <Button primary>Sign Up</Button>
          </Form.Field>
        </Form.Group>
      </Form>
    );
  }
}

export default SignUp;
