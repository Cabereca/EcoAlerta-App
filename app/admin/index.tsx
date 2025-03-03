import { Text, View } from '@/components/Themed';
import { HStack } from '@/components/ui/hstack';
import { ChevronDown, Leaf, SlidersHorizontal, User } from "lucide-react-native";

import { Box } from '@/components/ui/box';
import { Icon } from '@/components/ui/icon';
import { Pressable, ScrollView } from 'react-native';

type Status = 'pending' | 'inProgress' | 'completed';

// Status indicator component
const StatusIndicator = ({ status }: { status: Status }) => {
  const colors = {
    pending: "bg-red-200",
    inProgress: "bg-yellow-200",
    completed: "bg-green-200",
  }

  return <Box className={`w-3 h-3 rounded-full ${colors[status]}`} />
}

// Report item component

const ReportItem = ({ title, status }: {title: string, status: Status}) => {
  const bgColors = {
    pending: "bg-red-200",
    inProgress: "bg-yellow-200",
    completed: "bg-green-200",
  }

  return (
    <Pressable className={`p-4 border-b border-gray-200 ${bgColors[status]}`}>
      <HStack className="justify-between items-center">
        <Text className="text-gray-800 font-medium">{title}</Text>
        <Icon as={ChevronDown} size="sm" />
      </HStack>
    </Pressable>
  )
}

export default function ReportsScreen() {
  const reports = [
    { id: "A", title: "Denúncia A", status: "pending" as Status },
    { id: "B", title: "Denúncia B", status: "pending" as Status },
    { id: "C", title: "Denúncia C", status: "pending" as Status },
    { id: "D", title: "Denúncia D", status: "inProgress" as Status },
    { id: "E", title: "Denúncia E", status: "inProgress" as Status },
    { id: "F", title: "Denúncia F", status: "completed" as Status },
    { id: "G", title: "Denúncia G", status: "completed" as Status },
  ]

  return (
    <View>
      <Box className="flex-1 bg-green-50">
        <Box className="p-4 safe-top">
          {/* Header */}
          <HStack className="justify-between items-center mb-4">
            <HStack className="items-center">
              <Box className="w-10 h-10 bg-green-500 rounded-full justify-center items-center mr-2">
                <Icon as={Leaf} size="md" color="white" />
              </Box>
            </HStack>
            <Pressable className="w-10 h-10 rounded-full border border-gray-300 justify-center items-center">
              <Icon as={User} size="sm" />
            </Pressable>
          </HStack>

          {/* Title and Filter */}
          <HStack className="justify-between items-center mb-4">
            <Text className="text-lg font-bold">Todas as denúncias</Text>
            <Pressable>
              <Icon as={SlidersHorizontal} size="sm" />
            </Pressable>
          </HStack>

          {/* Legend */}
          <HStack className="mb-4">
            <HStack className="items-center justify-end mb-1">
              <StatusIndicator status="pending" />
              <Text className="ml-2">Pendente</Text>
            </HStack>
            <HStack className="items-center justify-end mb-1">
              <StatusIndicator status="inProgress" />
              <Text className="ml-2">Em andamento</Text>
            </HStack>
            <HStack className="items-center justify-end">
              <StatusIndicator status="completed" />
              <Text className="ml-2">Concluída</Text>
            </HStack>
          </HStack>
        </Box>

        {/* Reports List */}
        <ScrollView className="flex-1">
          {reports.map((report) => (
            <ReportItem key={report.id} title={report.title} status={report.status} />
          ))}
        </ScrollView>
      </Box>
    </View>
  )
}

