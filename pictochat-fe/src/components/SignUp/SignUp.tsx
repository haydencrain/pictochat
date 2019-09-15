import * as React from 'react';
import { Container, Header, Form, Button } from 'semantic-ui-react';
import UserService from '../../services/UserService';
import './Signup.less';
import { User } from '../../models/User';
import { render } from 'react-dom';
import { toUnicode } from 'punycode';

interface SignUpState {
  username: string;
  email: string;
  password: string;
}

class SignUp extends React.Component<{}, SignUpState> {
  constructor(props: any) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: ''
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
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

  async handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const user: User = {
      username: this.state.username,
      email: this.state.email,
      password: this.state.password
    };

    const res = await UserService.addUser(user);
    console.log(res);
  }

  render() {
    return (
      <Container id="register-container">
        <Header as="h1" className="heading center aligned header">
          Create an Account
        </Header>
        <Form id="register-form" onSubmit={this.handleSubmit} method="POST">
          <Form.Field className="register-field">
            <label>Username</label>
            <input
              type="text"
              placeholder="username"
              value={this.state.username}
              onChange={this.handleUsernameChange}
            />
          </Form.Field>
          <Form.Field className="register-field">
            <label>Email</label>
            <input type="text" placeholder="email" value={this.state.email} onChange={this.handleEmailChange} />
          </Form.Field>
          <Form.Field className="resgister-field">
            <label>Password</label>
            <input type="password" value={this.state.password} onChange={this.handlePasswordChange} />
          </Form.Field>
          <Form.Field>
            <Button primary className="register-button">
              Register
            </Button>
          </Form.Field>
        </Form>
      </Container>
    );
  }
}

// const SignUp = () => (
//   <form>
//     Username: <input className="user" type="text" />
//     <br />
//     Password: <input className="pwd" type="text" />
//     <br />
//     <input className="submit" type="submit" />
//   </form>
// );

export default SignUp;
