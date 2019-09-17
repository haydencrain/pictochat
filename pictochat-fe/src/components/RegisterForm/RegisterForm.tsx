import * as React from 'react';
import { Form, Button } from 'semantic-ui-react';
import UserService from '../../services/UserService';
import { User } from '../../models/User';
import './RegisterForm.less';

interface RegisterFormState {
  username: string;
  email: string;
  password: string;
  retryPwd: string;
}

interface RegisterFormProps {
  onCancelClick?: () => void;
  onSubmitSuccess?: () => void;
}

export default class RegisterForm extends React.Component<RegisterFormProps, RegisterFormState> {
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
    this.checkFormValidation = this.checkFormValidation.bind(this);
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
    this.props.onCancelClick && this.props.onCancelClick();
  }

  clearForm = () => {
    this.setState({
      username: '',
      email: '',
      password: '',
      retryPwd: ''
    });
  };

  checkFormValidation() {
    const { username, email, password, retryPwd } = this.state;
    if (!username || !email || !password) {
      throw new Error('One or more required fields are empty!');
    }
    if (retryPwd !== password) {
      throw new Error('Passwords do not match!');
    }
  }

  async handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const user: User = {
      username: this.state.username,
      email: this.state.email,
      password: this.state.password
    };
    try {
      this.checkFormValidation();
      const res = await UserService.addUser(user);
      if (res.message) {
        alert(res.message);
        this.props.onSubmitSuccess && this.props.onSubmitSuccess();
      }
    } catch (e) {
      alert(e.message);
    }
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
            <Button type="button" onClick={this.handleCancelClick}>
              Cancel
            </Button>
          </Form.Field>
          <Form.Field className="register-button">
            <Button primary type="submit">
              Sign Up
            </Button>
          </Form.Field>
        </Form.Group>
      </Form>
    );
  }
}
