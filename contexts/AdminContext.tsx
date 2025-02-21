import { Employee } from '@/@types/Employee';
import { User } from '@/@types/User';
import api from '@/services/api';
import storage from '@/storage/init';
import { createContext, PropsWithChildren, useEffect, useState } from 'react';

interface AdminContextType {
  user: Employee | User | null;
  isAdmin: boolean;
  login: (email: string, password: string) => void,
  logout: () => void,
  setIsAdmin: (isAdmin: boolean) => void;
}

export const AdminContext = createContext<AdminContextType>({
  user: null,
  isAdmin: false,
  setIsAdmin: () => {},
  login: () => {},
  logout: () => {}
});

export const AdminProvider = ({ children }: PropsWithChildren<{}>) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<Employee | User | null>(null);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post("/employeeLogin", {email, password});

      console.log(res);

    } catch (error) {
      console.log(error)
    }
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
