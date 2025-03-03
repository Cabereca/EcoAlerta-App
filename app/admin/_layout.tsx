import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { AdminProvider } from '@/contexts/AdminContext';
import { useAdminAuth } from '@/hooks/useAuth';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRoute } from '@react-navigation/native';
import { Link, Tabs } from 'expo-router';
import { Leaf, User } from 'lucide-react-native';
import React from 'react';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { isAdmin, user } = useAdminAuth();
  const router = useRoute();

  if (isAdmin && user) {
    return (
      <AdminProvider>
        <HStack className="justify-between items-center mb-4 p-8">
          <HStack className="items-center">
            <Link href="/admin">
              <Box className={`w-10 h-10 rounded-full justify-center items-center mr-2 ${router.name === 'index' ? 'bg-green-500' : 'bg-gray-300'}`}>
                <Icon as={Leaf} size="md" color="white" />
              </Box>
            </Link>
          </HStack>
          <Link href="/admin/profile">
            <Box className={`w-10 h-10 rounded-full border border-gray-300 justify-center items-center ${router.name === 'profile' ? 'bg-green-500' : 'bg-gray-300'}`}>
              <Icon as={User} size="xl" />
            </Box>
          </Link>
        </HStack>

        <Tabs
          screenOptions={{
            tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
            // Disable the static render of the header on web
            // to prevent a hydration error in React Navigation v6.
            headerShown: useClientOnlyValue(false, false),
            tabBarStyle: { display: 'none' },
          }}>
          <Tabs.Screen
            name="index"
            options={{
              title: 'Denúncias',
              tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
              headerShown: false,
            }}
          />
        </Tabs>
      </AdminProvider>
    );
  }

  if (!isAdmin && user) {
    return (
      <AdminProvider>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
            // Disable the static render of the header on web
            // to prevent a hydration error in React Navigation v6.
            headerShown: useClientOnlyValue(false, false),
            tabBarStyle: { display: 'none' },

          }}>
          <Tabs.Screen
            name="login"
            options={{
              title: 'Admin Login',
              tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
            }}
          />
        </Tabs>
      </AdminProvider>
    );
  }

  if (!isAdmin && !user) {
    return (
      <AdminProvider>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
            // Disable the static render of the header on web
            // to prevent a hydration error in React Navigation v6.
            tabBarStyle: { display: 'none' },
            headerShown: useClientOnlyValue(false, false),
          }}>
          <Tabs.Screen
            name="login"
          />
          <Tabs.Screen
            name="registro"
          />
        </Tabs>
      </AdminProvider>
    );
  }


  return (
      <Tabs
        screenOptions={{
          tabBarStyle: { backgroundColor: 'red' },

          // Disable the static render of the header on web
          // to prevent a hydration error in React Navigation v6.
          headerShown: useClientOnlyValue(false, false),
        }}>
        <Tabs.Screen
          name="login"
          options={{
            headerShown: false,
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
  );
}

