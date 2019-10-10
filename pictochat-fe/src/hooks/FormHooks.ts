import { useState } from 'react';

// TODO: Create a shared 'useForm' hook, which can be used for both register and login!

export function useRegisterForm(): {
  username: string;
  email: string;
  password: string;
  retryPassword: string;
  setFormField: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearForm: () => void;
} {
  const getEmptyForm = () => ({ username: '', email: '', password: '', retryPassword: '' });
  const [form, setForm] = useState(getEmptyForm());

  const setFormField = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const clearForm = () => {
    setForm(getEmptyForm());
  };

  return {
    username: form.username,
    email: form.email,
    password: form.password,
    retryPassword: form.retryPassword,
    setFormField,
    clearForm
  };
}

export function useLoginForm(): {
  username: string;
  password: string;
  setFormField: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearForm: () => void;
} {
  const getEmptyForm = () => ({ username: '', password: '' });
  const [form, setForm] = useState(getEmptyForm());

  const setFormField = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const clearForm = () => {
    setForm(getEmptyForm());
  };

  return {
    username: form.username,
    password: form.password,
    setFormField,
    clearForm
  };
}
