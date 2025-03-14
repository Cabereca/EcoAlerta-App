import { Employee } from '@/@types/Employee';
import storage from '@/storage/init';
import { router } from 'expo-router';
import { createContext, PropsWithChildren, useEffect, useState } from 'react';

interface AdminContextType {
  user: Employee | null;
  isAdmin: boolean;
  login: (user: Employee, token: string) => void,
  logout: () => void,
  setIsAdmin: (isAdmin: boolean) => void;
}

export const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: PropsWithChildren<{}>) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<Employee | null>(null);
  const [token, setToken] = useState<string | null>(null)

  const login = async (user: Employee, token: string) => {
    setIsAdmin(true);
    setUser(user);
    setToken(token)
    await storage.save({ key: 'user', data: user });
    await storage.save({ key: 'token', data: token });
    await storage.save({ key: 'isAdmin', data: true });
    router.navigate('/admin');
  };

  const logout = () => {
    setIsAdmin(false);
    setUser(null);
    setToken(null);
    storage.remove({ key: 'user' });
    storage.remove({ key: 'token' });
  };

  useEffect(() => {
    (async () => {
      const user = await storage.load<Employee>({ key: 'user' });
      const token = await storage.load<string>({ key: 'token' });

      if (user && token) {
        setUser(user);
        setIsAdmin(true);
        setToken(token);
      }

      return;
    })()
  }, [])

  return (
    <AdminContext.Provider value={{ user, isAdmin, setIsAdmin, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
};
