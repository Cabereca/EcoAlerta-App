import AdminProtectedRoute from '@/components/AdminProtectedRoute';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import React from 'react';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function AdminLayout() {
  return (
    <AdminProtectedRoute>
      <Tabs
        screenOptions={{
          // Disable the static render of the header on web
          // to prevent a hydration error in React Navigation v6.
          headerShown: useClientOnlyValue(false, false),
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Denúncias',
            tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Perfil',
            tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="login"
          options={{
            headerShown: false,
            tabBarStyle: { display: 'none' },
          }}
        />
        <Tabs.Screen
          name="registro"
          options={{
            headerShown: false,
            tabBarStyle: { display: 'none' },
          }}
        />
      </Tabs>
    </AdminProtectedRoute>
  );
}