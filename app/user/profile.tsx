import { Text } from '@/components/Themed'
import { Box } from '@/components/ui/box'
import { Divider } from '@/components/ui/divider'
import { Icon } from '@/components/ui/icon'
import { VStack } from '@/components/ui/vstack'
import { useUserAuth } from '@/hooks/useAuth'
import { useNavigation } from 'expo-router'
import { ChevronRight, User } from "lucide-react-native"
import { Pressable } from 'react-native'

// Menu Item Component
const MenuItem = ({
  label,
  onPress,
  isDestructive = false,
}: {
  label: string
  onPress: () => void
  isDestructive?: boolean
}) => {
  return (
    <>
      <Pressable className="flex-row items-center justify-between py-4 px-6" onPress={onPress}>
        <Text className={`text-base`} style={{color: isDestructive ? 'red' : 'gray'}}>{label}</Text>
        <Icon as={ChevronRight} size="sm" color={isDestructive ? "#ef4444" : "#1f2937"} />
      </Pressable>
      <Divider className="bg-gray-200" />
    </>
  )
}

export default function ProfileScreen() {
  const { user, logout } = useUserAuth()
  const navigation = useNavigation()

  const handleMyReports = () => {
    navigation.navigate("myReports")
  }

  const handleEditInfo = () => {
    navigation.navigate("editProfile")
  }

  const handleLogout = () => {
    logout()
    navigation.navigate("(tabs)")
  }

  return (
    <>
      <Box className="flex-1 bg-white">
        {/* Profile Header */}
        <VStack className="items-center pt-12 pb-8">
          <Box className="w-24 h-24 rounded-full bg-gray-100 items-center justify-center mb-4">
            <Icon as={User} size="xl" color="#9ca3af" />
          </Box>
          <Text className="text-xl font-medium text-gray-800">{user?.name}</Text>
        </VStack>

        {/* Menu Items */}
        <Box className="mt-4">
          <Divider className="bg-gray-200" />
          <MenuItem label="Minhas denúncias" onPress={handleMyReports} />
          <MenuItem label="Alterar informações" onPress={handleEditInfo} />
          <MenuItem label="Sair" onPress={handleLogout} isDestructive />
        </Box>
      </Box>
    </>
  )
}

