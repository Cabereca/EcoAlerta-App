import { useUserAuth } from '@/hooks/useAuth';
import { Redirect } from 'expo-router';
import React, { useEffect } from 'react';

const UserProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUserAuth();

  useEffect(() => {
    console.log(user);

    if (!user) {
      <Redirect href="/(tabs)" />;

      return;
    }

    <Redirect href="/user/home" />;
  }, []);


  return <>{children}</>;
};

export default UserProtectedRoute;