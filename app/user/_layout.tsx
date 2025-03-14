import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import UserProtectedRoute from '@/components/UserProtectedRoute';
import { useUserAuth } from '@/hooks/useAuth';
import { Entypo } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof Entypo>['name'];
  color: string;
}) {
  return <Entypo size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function UserLayout() {
  const { user } = useUserAuth();
  return (
    <UserProtectedRoute>
      <Tabs
        screenOptions={{
          tabBarStyle: { display: user ? 'flex' : 'none' },
          // Disable the static render of the header on web
          // to prevent a hydration error in React Navigation v6.
          headerShown: useClientOnlyValue(false, false),
        }}>
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => (
              <TabBarIcon name='home' color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="novaOcorrencia"
          options={{
            title: 'Ocorrências',
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <TabBarIcon name='megaphone' color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Perfil',
            tabBarIcon: ({ color }) => (
              <TabBarIcon name='user' color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name='editProfile'
          options={{
            title: 'Editar Perfil',
            tabBarIcon: ({ color }) => (
              <TabBarIcon name='edit' color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name='myReports'
          options={{
            title: 'Minhas Denúncias',
            tabBarIcon: ({ color }) => (
              <TabBarIcon name='list' color={color} />
            ),
          }}
        />
      </Tabs>
    </UserProtectedRoute>
  );
}