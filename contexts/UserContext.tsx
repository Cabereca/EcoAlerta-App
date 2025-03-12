import { User } from '@/@types/User';
import storage from '@/storage/init';
import { router } from 'expo-router';
import { createContext, PropsWithChildren, useEffect, useState } from 'react';

interface UserContextType {
  user: User | null;
  login: (user: {user: User}, token: string) => void,
  logout: () => void,
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: PropsWithChildren<{}>) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (user: { user: User }, token: string) => {
    setUser(user.user);
    await storage.save({ key: 'user', data: user });
    await storage.save({ key: 'token', data: token });
    router.push('/user/home');
  };

  const logout = () => {
    setUser(null);
    storage.remove({ key: 'user' });
    storage.remove({ key: 'token' });
  };

  useEffect(() => {
    (async () => {
      const user = await storage.load<User>({ key: 'user' });
      const token = await storage.load<string>({ key: 'token' });

      if (user && token)
        setUser(user);

      return;
    })()
  }, [])

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
