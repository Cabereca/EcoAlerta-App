"use client"

import type { Occurrence } from "@/@types/Occurrence"
import { AdminOcurrenceView } from '@/components/AdminOcurrenceView'
import { Text } from "@/components/Themed"
import { Box } from "@/components/ui/box"
import { Heading } from "@/components/ui/heading"
import { HStack } from "@/components/ui/hstack"
import { useToast } from "@/components/ui/toast"
import { VStack } from "@/components/ui/vstack"
import api from '@/services/api'
import { useNavigation } from "@react-navigation/native"
import { useEffect, useState } from "react"
import { ActivityIndicator, ScrollView } from "react-native"

export default function AdminOccurrencesScreen() {
  const navigation = useNavigation()
  const toast = useToast()
  const [occurrences, setOccurrences] = useState<Occurrence[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOccurrences()
  }, [])

  const fetchOccurrences = async () => {
    try {
      const {data} = await api.get('/occurrence/all')

      setOccurrences(data)
    } catch (error) {
      toast.show({
        render: () => (
          <Box className="bg-red-500 p-4 rounded-lg">
            <Text style={{color: 'white'}}>Não foi possível carregar as denúncias.</Text>
          </Box>
        ),
      })
    } finally {
      setLoading(false)
    }
  }



  if (loading) {
    return (
      <Box className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#22c55e" />
      </Box>
    )
  }

  return (
    <Box className="flex-1 bg-gray-50">
      <HStack className="bg-white p-4 items-center justify-between border-b border-gray-200">
        <HStack className="items-center space-x-4">
          <Heading className="text-gray-800 text-lg">Administração de Denúncias</Heading>
        </HStack>
      </HStack>

      <ScrollView>
        <VStack className="p-4 space-y-2">
          {occurrences.map((occurrence) => (
            <AdminOcurrenceView
              key={occurrence.id}
              occurrence={occurrence}
              occurrences={occurrences}
              setOccurrences={setOccurrences}
            />
          ))}
        </VStack>
      </ScrollView>
    </Box>
  )
}
