import * as React from 'react';
import { Container, Header, Form, Button } from 'semantic-ui-react';

import './Login.less';

export default (props: {}) => (
  <Container id="login-container">
    <Header as="h1" className="heading">
      My Profile
    </Header>
    <Form id="login-form" className="ui raised segment">
      <Form.Field className="login-field">
        <label>Username or Email</label>
        <input type="text" placeholder="name@domain.com" />
      </Form.Field>
      <Form.Field className="login-field">
        <label>Password</label>
        <input type="password" />
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
