import { Employee } from '@/@types/Employee';
import { User } from '@/@types/User';
import storage from '@/storage/init';
import { createContext, PropsWithChildren, useEffect, useState } from 'react';

interface AdminContextType {
  user: Employee | User | null;
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
}

export const AdminContext = createContext<AdminContextType>({
  user: null,
  isAdmin: false,
  setIsAdmin: () => {},
});

export const AdminProvider = ({ children }: PropsWithChildren<{}>) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<Employee | User | null>(null);

  useEffect(() => {
    (async () => {
      const user = await storage.load<Employee>({ key: 'user' });

      if (user) {
        setUser(user);
        setIsAdmin(true);
      }

      return;
    })()
  }, [])

  return (
    <AdminContext.Provider value={{ user, isAdmin, setIsAdmin }}>
      {children}
    </AdminContext.Provider>
  );
};
