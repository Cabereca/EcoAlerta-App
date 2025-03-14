import { useAdminAuth } from '@/hooks/useAuth';
import { Redirect } from 'expo-router';
import React, { useEffect } from 'react';

const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAdminAuth();

  useEffect(() => {
    if (!user) {
      <Redirect href="/admin/login" />;

      return;
    }

    <Redirect href="/admin" />
  }, [])
  return <>{children}</>;
};

export default AdminProtectedRoute;
