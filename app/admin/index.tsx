import { Occurrence } from '@/@types/Occurrence';
import { Text } from '@/components/Themed';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { VStack } from '@/components/ui/vstack';
import api from '@/services/api';
import { ChevronDown, SlidersHorizontal } from "lucide-react-native";
import { useEffect, useState } from 'react';
import { Pressable, ScrollView } from 'react-native';

type Status = 'OPEN' | 'IN_PROGRESS' | 'CLOSED';

// Status indicator component
const StatusIndicator = ({ status }: { status: Status }) => {
  const colors = {
    OPEN: "bg-red-500",
    IN_PROGRESS: "bg-yellow-500",
    CLOSED: "bg-green-500"
  }

  return <Box className={`w-3 h-3 rounded-full ${colors[status]}`} />
}

// Report item component

const ReportItem = ({ title, status }: {title: string, status: Status}) => {
  const bgColors = {
    OPEN: "bg-red-500",
    IN_PROGRESS: "bg-yellow-50",
    CLOSED: "bg-green-50"
  }

  return (
    <Pressable className={`w-full p-4 border-b border-gray-200 ${bgColors[status]}`}>
      <HStack className="justify-between items-center">
        <Text className="text-gray-800 font-medium">{title}</Text>
        <Icon as={ChevronDown} size="sm" />
      </HStack>
    </Pressable>
  )
}

export default function ReportsScreen() {
  const [reports, setReports] = useState<Occurrence[] | undefined>(undefined);
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/occurrence/all');

        console.log(res.data);

        setReports(res.data);

      } catch (error) {
        console.error(error);
      }
    })()
  }, [])

  return (
    <>
      <Box className="flex-1 bg-green-50">
        <Box className="p-4 safe-top">
          {/* Title and Filter */}
          <HStack className="justify-between items-center mb-4">
            <Text className="text-lg font-bold text-black">Todas as denúncias</Text>
            <Pressable>
              <Icon as={SlidersHorizontal} size="md" />
            </Pressable>
          </HStack>

          {/* Legend */}
          <VStack className="mb-4">
            <HStack className="items-center justify-end mb-1">
              <StatusIndicator status="OPEN" />
              <Text className="ml-2">Pendente</Text>
            </HStack>
            <HStack className="items-center justify-end mb-1">
              <StatusIndicator status="IN_PROGRESS" />
              <Text className="ml-2">Em andamento</Text>
            </HStack>
            <HStack className="items-center justify-end">
              <StatusIndicator status="CLOSED" />
              <Text className="ml-2">Concluída</Text>
            </HStack>
          </VStack>
        </Box>

        {/* Reports List */}
        <ScrollView className="flex-1">
          {reports?.map((report) => (
            <ReportItem key={report.id} title={report.title} status={report.status} />
          ))}
        </ScrollView>
      </Box>
    </>
  )
}

