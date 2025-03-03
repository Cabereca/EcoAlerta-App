import { Employee } from '@/@types/Employee';
import storage from '@/storage/init';
import { createContext, PropsWithChildren, useEffect, useState } from 'react';

interface AdminContextType {
  user: Employee | null;
  isAdmin: boolean;
  login: (user: Employee) => void,
  logout: () => void,
  setIsAdmin: (isAdmin: boolean) => void;
}

export const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: PropsWithChildren<{}>) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<Employee | null>(null);

  const login = async (user: Employee) => {
    setIsAdmin(true);
    setUser(user);
    await storage
  };

  const logout = () => {
    // Implement logout logic here
  };

  useEffect(() => {
    (async () => {
      const user = await storage.load<Employee>({ key: 'user' });

      if (user) {
        setUser(user);
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
