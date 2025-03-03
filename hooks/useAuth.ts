import { AdminContext } from '@/contexts/AdminContext';
import { useContext } from 'react';

export const useAdminAuth = () => {
  const context = useContext(AdminContext);

  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminProvider');
  }

  const { user, isAdmin, setIsAdmin, login, logout } = context;

  return { user, isAdmin, setIsAdmin, login, logout };
}
