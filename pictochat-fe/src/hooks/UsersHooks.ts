import User from '../models/User';
import userService from '../services/UserService';
import { useState, useEffect } from 'react';

export function useFetchCurrentUser(): [User, boolean] {
  const [user, setUser] = useState<User>();
  const [isLoading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const fetchData = async () => {
      let user = undefined;
      try {
        user = new User(await userService.getCurrentUser());
      } catch (e) {}
      setUser(user);
      setLoading(false);
    };
    fetchData();
  }, []);

  return [user, isLoading];
}

export function useFetchUser(username: string): [User, boolean] {
  const [user, setUser] = useState<User>();
  const [isLoading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      let user = undefined;
      try {
        user = new User(await userService.getUser(username));
      } catch (e) {}
      setUser(user);
      setLoading(false);
    };
    fetchData();
  }, [username]);

  return [user, isLoading];
}
