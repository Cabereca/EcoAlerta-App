"use client"

import type { Occurrence } from "@/@types/Occurrence"
import { Text } from "@/components/Themed"
import { Box } from "@/components/ui/box"
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { HStack } from "@/components/ui/hstack"
import { Icon } from "@/components/ui/icon"
import { useToast } from "@/components/ui/toast"
import { VStack } from "@/components/ui/vstack"
import { useUserAuth } from '@/hooks/useAuth'
import api from '@/services/api'
import { useNavigation } from "@react-navigation/native"
import { ArrowLeft, ChevronDown, ChevronUp, Edit2, XCircle } from "lucide-react-native"
import { useEffect, useState } from "react"
import { Pressable, ScrollView } from "react-native"

export default function MyOccurrencesScreen() {
  const navigation = useNavigation()
  const toast = useToast()
  const { user } = useUserAuth()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [occurrences, setOccurrences] = useState<Occurrence[] | undefined>(undefined)

  const handleToggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const handleEdit = (occurrence: Occurrence) => {
    navigation.navigate("editOccurrence", { id: occurrence.id })
  }

  const handleClose = async (occurrence: Occurrence) => {
    try {
      await api.delete(`/occurrence/${occurrence.id}`)
      setOccurrences((prev) => prev?.filter((item) => item.id !== occurrence.id))

      toast.show({
        render: () => (
          <Box className="bg-green-500 p-4 rounded-lg">
            <Text style={{color: 'white'}}>Denúncia deletada com sucesso.</Text>
          </Box>
        )
      })
    } catch (error) {
      toast.show({
        render: () => (
          <Box className="bg-red-500 p-4 rounded-lg">
            <Text style={{color: 'white'}}>Erro ao fechar a denúncia. Tente novamente mais tarde.</Text>
          </Box>
        )
      })
    }
  }

  const getStatusColor = (status: Occurrence["status"]) => {
    switch (status) {
      case "OPEN":
        return "bg-yellow-500"
      case "IN_PROGRESS":
        return "bg-blue-500"
      case "CLOSED":
        return "bg-green-500"
    }
  }

  const getStatusText = (status: Occurrence["status"]) => {
    switch (status) {
      case "OPEN":
        return "Aberta"
      case "IN_PROGRESS":
        return "Em Andamento"
      case "CLOSED":
        return "Fechada"
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  useEffect(() => {
    (async () => {
        try {
          const res = await api.get<Occurrence[]>(`/occurrence/byUser/${user?.id}`)
          setOccurrences(res.data)
        } catch (error) {
          console.error("Error fetching occurrences:", error)
        }
    })()
  }, [])

  return (
    <Box className="flex-1 bg-gray-50">
      <HStack className="bg-white p-4 items-center justify-between border-b border-gray-200">
        <HStack className="items-center space-x-4">
          <Pressable onPress={() => navigation.goBack()}>
            <Icon as={ArrowLeft} size="md" />
          </Pressable>
          <Heading className="text-lg ml-8">Minhas denúncias</Heading>
        </HStack>
      </HStack>

      <ScrollView>
        <VStack className="p-4 space-y-2">
          {occurrences?.map((occurrence) => (
            <Pressable key={occurrence.id} onPress={() => handleToggleExpand(occurrence.id)}>
              <VStack className="bg-white rounded-lg overflow-hidden border border-gray-200">
                <HStack className="p-4 justify-between items-center">
                  <Text className="font-medium" style={{color: 'gray'}}>{occurrence.title}</Text>
                  <Icon
                    as={expandedId === occurrence.id ? ChevronUp : ChevronDown}
                    style={{color: '#6b7280'}}
                    size="sm"
                  />
                </HStack>

                {expandedId === occurrence.id && (
                  <VStack className="p-4 border-t border-gray-200 space-y-4">
                    <VStack className="space-y-2">
                      <Text style={{color: '#6b7280'}}>Status</Text>
                      <Box className={`px-3 py-1 rounded-full self-start ${getStatusColor(occurrence.status)}`}>
                        <Text className="text-white text-sm">{getStatusText(occurrence.status)}</Text>
                      </Box>
                    </VStack>

                    <VStack className="space-y-2">
                      <Text style={{color: '#6b7280'}}>Descrição</Text>
                      <Text className="text-gray-800">{occurrence.description}</Text>
                    </VStack>

                    <VStack className="space-y-2">
                      <Text style={{color: '#6b7280'}}>Data</Text>
                      <Text className="text-gray-800">{formatDate(occurrence.dateTime)}</Text>
                    </VStack>

                    {occurrence.feedback && (
                      <VStack className="space-y-2">
                        <Text style={{color: '#6b7280'}}>Feedback</Text>
                        <Text>{occurrence.feedback}</Text>
                      </VStack>
                    )}

                    <HStack className="space-x-2 pt-2">
                      <Button className="flex-1 bg-blue-500" onPress={() => handleEdit(occurrence)}>
                        <Icon as={Edit2} className="text-white mr-2" size="sm" />
                        <Text style={{color: 'white'}}>Editar</Text>
                      </Button>
                      <Button
                        className="flex-1 bg-red-500"
                        onPress={() => handleClose(occurrence)}
                        isDisabled={occurrence.status === "CLOSED"}
                      >
                        <ButtonIcon as={XCircle} className="text-white mr-2" size="sm" />
                        <ButtonText style={{color: 'white'}}>Deletar</ButtonText>
                      </Button>
                    </HStack>
                  </VStack>
                )}
              </VStack>
            </Pressable>
          ))}
        </VStack>
      </ScrollView>
    </Box>
  )
}

