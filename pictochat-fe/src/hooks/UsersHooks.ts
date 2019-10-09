import User from '../models/store/User';
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
      setLoading(true);
      try {
        const user = new User(await userService.getUser(username));
        setUser(user);
      } catch (e) {
        setUser(null);
      }
      setLoading(false);
    };
    fetchData();
  }, [username]);

  return [user, isLoading];
}
