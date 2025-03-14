import { useUserAuth } from '@/hooks/useAuth';
import { Redirect } from 'expo-router';
import React, { useEffect } from 'react';

const UserProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUserAuth();

  useEffect(() => {
    if (!user) {
      <Redirect href="/(tabs)" />;

      return;
    }
  }, []);


  return <>{children}</>;
};

export default UserProtectedRoute;