import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { Tabs } from 'expo-router';
import React from 'react';


export default function TabLayout() {
  return (
      <Tabs
        screenOptions={{
          tabBarStyle: { display: 'none' },

          // Disable the static render of the header on web
          // to prevent a hydration error in React Navigation v6.
          headerShown: useClientOnlyValue(false, false),
        }}>
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
          }}
        />
        <Tabs.Screen
          name="novaOcorrencia"
          options={{
            title: 'Ocorrências',
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Perfil',
          }}
        />
        <Tabs.Screen
          name='editProfile'
          options={{
            title: 'Editar Perfil',
          }}
        />
        <Tabs.Screen
          name='myReports'
          options={{
            title: 'Minhas Denúncias',
          }}
        />
        <Tabs.Screen
          name='editOccurrence'
          options={{
            title: 'Editar Denúncia',
          }}
        />

      </Tabs>
  );
}

