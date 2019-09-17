import { User } from '../models/User';
import userService from '../services/UserService';
import { useState, useEffect } from 'react';

export function useFetchUser(id?: string): [User, boolean] {
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const fetchData = async () => {
      const user = await userService.getUser('1');
      setUser(user);
      setLoading(false);
    };
    fetchData();
  }, [id]);

  return [user, loading];
}
