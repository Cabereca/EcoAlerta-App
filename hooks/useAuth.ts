import { AdminContext } from '@/contexts/AdminContext';
import { useContext } from 'react';

export const useAuth = () => {
  const { user, isAdmin, setIsAdmin } = useContext(AdminContext);

  return { user, isAdmin, setIsAdmin };
}
