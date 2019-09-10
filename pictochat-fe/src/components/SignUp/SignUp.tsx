import * as React from 'react';
import { Container, Header, Form, Button } from 'semantic-ui-react';
import UserService from '../../services/UserService';
import './Signup.less';
import { User } from '../../models/User';
import { render } from 'react-dom';

interface SignUpState {
  username: string;
  password: string;
}

class SignUp extends React.Component<{}, SignUpState>{
  constructor(props: any) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  handleUsernameChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ username: event.target.value })
  }

  handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ password: event.target.value })
  }

  async handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const user: User = {
      username: this.state.username,
      email: '',
      password: this.state.password
    }

    const res = await UserService.addUser(user);
    console.log(res);

  }

  render() {
    return (
      <Container id="register-container">
        <Header as="h1" className="heading">
          Register
        </Header>

        <Form id="register-form" className="ui raised segment" onSubmit={this.handleSubmit} method="POST">
          <Form.Field className='register-field'>
            <label>Username</label>
            <input type="text" placeholder="username" value={this.state.username} onChange={this.handleUsernameChange} />
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
