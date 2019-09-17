import { User } from '../models/User';
import userService from '../services/UserService';
import { useState, useEffect } from 'react';

export function useFetchCurrentUser(): [User, boolean] {
  const [user, setUser] = useState<User>();
  const [isLoading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const fetchData = async () => {
      let user = undefined;
      try {
        user = await userService.getCurrentUser();
      } catch (e) {}
      setUser(user);
      setLoading(false);
    };
    fetchData();
  }, []);

  return [user, isLoading];
}
