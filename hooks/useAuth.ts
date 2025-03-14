import { AdminContext } from '@/contexts/AdminContext';
import { UserContext } from '@/contexts/UserContext';
import { useContext } from 'react';

export const useAdminAuth = () => {
  const context = useContext(AdminContext);

  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminProvider');
  }

  const { user, isAdmin, setIsAdmin, login, logout } = context;

  return { user, isAdmin, setIsAdmin, login, logout };
}

export const useUserAuth = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUserAuth must be used within an UserProvider');
  }

  const { user, login, logout } = context;

  return { user, login, logout };
}
