import * as React from 'react';
import * as EmailValidator from 'email-validator';
import { Form, Button } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import StoresContext from '../../../contexts/StoresContext';
import UnauthenticatedUser from '../../../models/UnauthenticatedUser';
import './RegisterForm.less';
import { useRegisterForm } from '../../../hooks/FormHooks';

interface RegisterFormProps {
  onCancelClick?: () => void;
  onSubmitSuccess?: () => void;
}

function RegisterForm(props: RegisterFormProps) {
  const userStore = React.useContext(StoresContext).user;
  const { username, email, password, retryPassword, setFormField, clearForm } = useRegisterForm();

  const onlyLettersAndNumbers = (str: string): boolean => {
    return /^[A-Za-z0-9]+$/.test(str);
  };

  const validateForm = () => {
    if (!username || !email || !password) {
      throw new Error('One or more required fields are empty!');
    }
    if (retryPassword !== password) {
      throw new Error('Passwords do not match!');
    }
    if (!EmailValidator.validate(email)) {
      throw new Error('Email is not valid!');
    }
    if (!onlyLettersAndNumbers(username)) {
      throw new Error('Username must only contain letters and numbers!');
    }
  };

  const handleCancelClick = (event: React.SyntheticEvent<any>) => {
    event.preventDefault();
    clearForm();
    props.onCancelClick && props.onCancelClick();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      validateForm();
      const userJson: UnauthenticatedUser = {
        username,
        email,
        password: password
      };
      await userStore.createUserAndAuth(userJson); // assuming an error is thrown if creation failed - Jordan
      alert('User created sucessfully');
      props.onSubmitSuccess && props.onSubmitSuccess();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <Form id="register-form" onSubmit={handleSubmit} method="POST">
      <h1>Create an Account</h1>
      <Form.Field className="register-field-username">
        <label>Username</label>
        <input name="username" type="text" value={username} onChange={setFormField} />
      </Form.Field>
      <Form.Field className="register-field-email">
        <label>Email</label>
        <input name="email" type="text" value={email} onChange={setFormField} />
      </Form.Field>
      <Form.Field className="register-field-password">
        <label>Password</label>
        <input name="password" type="password" value={password} onChange={setFormField} />
      </Form.Field>
      <Form.Field className="register-field-retry-password">
        <label>Re-type Password</label>
        <input name="retryPassword" type="password" value={retryPassword} onChange={setFormField} />
      </Form.Field>
      <Form.Group className="register-actions">
        <Form.Field className="cancel-button">
          <Button type="button" onClick={handleCancelClick}>
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

export default observer(RegisterForm);
