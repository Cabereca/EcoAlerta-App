import { Occurrence } from '@/@types/Occurrence'
import api from '@/services/api'
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, MapPin, PlayCircle } from 'lucide-react-native'
import { useState } from 'react'
import { ActivityIndicator, Pressable } from 'react-native'
import { Text } from './Themed'
import { Box } from './ui/box'
import { Button, ButtonIcon, ButtonText } from './ui/button'
import { HStack } from './ui/hstack'
import { Icon } from './ui/icon'
import { Image } from './ui/image'
import { Textarea, TextareaInput } from './ui/textarea'
import { useToast } from './ui/toast'
import { VStack } from './ui/vstack'

interface AdminOcurrenceViewProps {
  occurrence: Occurrence
  occurrences: Occurrence[]
  setOccurrences: (occurrences: Occurrence[]) => void
}

export const AdminOcurrenceView = ({occurrence, occurrences, setOccurrences}: AdminOcurrenceViewProps) => {
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<Record<string, string>>({})
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [imageIndex, setImageIndex] = useState(0)

  const toast = useToast()

  const handleToggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const handleStartProcess = async (id: string) => {
    setProcessingId(id)
    try {
      await api.patch(`/occurrence/${id}/IN_PROGRESS`)
      setOccurrences(occurrences.map((occ) => (occ.id === id ? { ...occ, status: "IN_PROGRESS" } : occ)))

      toast.show({
        render: () => (
          <Box className="bg-green-500 p-4 rounded-lg">
            <Text style={{color: 'white'}}>Processamento iniciado com sucesso.</Text>
          </Box>
        ),
      })
    } catch (error) {
      toast.show({
        render: () => (
          <Box className="bg-red-500 p-4 rounded-lg">
            <Text style={{color: 'white'}}>Não foi possível iniciar o processamento.</Text>
          </Box>
        ),
      })
    } finally {
      setProcessingId(null)
    }
  }

  const handleSubmitFeedback = async (id: string) => {
    if (!feedback[id] || feedback[id].trim() === "") {
      toast.show({
        render: () => (
          <Box className="bg-red-500 p-4 rounded-lg">
            <Text style={{color: 'white'}}>O feedback é obrigatório.</Text>
          </Box>
        ),
      })
      return
    }

    setProcessingId(id)
    try {
      await api.patch(`/occurrence/${id}/CLOSED`, { feedback: feedback[id] })
      setOccurrences(
        occurrences.map((occ) => (occ.id === id ? { ...occ, status: "CLOSED", feedback: feedback[id] } : occ)),
      )

      toast.show({
        render: () => (
          <Box className="bg-green-500 p-4 rounded-lg">
            <Text style={{color: 'white'}}>Denúncia fechada com sucesso.</Text>
          </Box>
        ),
      })
    } catch (error) {
      toast.show({
        render: () => (
          <Box className="bg-red-500 p-4 rounded-lg">
            <Text style={{color: 'white'}}>Não foi possível fechar a denúncia.</Text>
          </Box>
        ),
      })
    } finally {
      setProcessingId(null)
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

  const formatLocation = (location: { lat: number; lng: number }) => {
    return `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
  }

  const getImageUrl = (path: string) => {
    return `${api.defaults.baseURL}/images/${path}`
  }

  const handleGoToNextImage = () => {
    if (occurrence.images) {
      setImageIndex((imageIndex + 1) % occurrence.images.length)
    }
  }

  const handleGoToPreviousImage = () => {
    if (occurrence.images) {
      setImageIndex((imageIndex - 1 + occurrence.images.length) % occurrence.images.length)
    }
  }

  return (
    <Pressable key={occurrence.id} onPress={() => handleToggleExpand(occurrence.id)}>
      <VStack className="bg-white rounded-lg overflow-hidden border border-gray-200">
        <HStack className="p-4 justify-between items-center">
          <HStack className="items-center space-x-2">
            <Box className={`w-3 h-3 rounded-full mr-4 ${getStatusColor(occurrence.status)}`} />
            <Text className="font-medium text-gray-800">{occurrence.title}</Text>
          </HStack>
          <Icon
            as={expandedId === occurrence.id ? ChevronUp : ChevronDown}
            className="text-gray-500"
            size="sm"
          />
        </HStack>

        {expandedId === occurrence.id && (
          <VStack className="p-4 border-t border-gray-200 space-y-4">
            {occurrence.images && occurrence.images.length > 0 && (
              <Box className='relative w-full h-48'>
                <Box className="h-48 bg-gray-100 rounded-lg overflow-hidden">
                  <Image alt={`Imagem ${occurrence.id}`} source={{ uri: getImageUrl(occurrence.images[imageIndex].path) }} className='w-full h-48' resizeMode="cover" />
                </Box>
                <Button
                  className="bg-blue-500 absolute top-1/2 right-2 rounded-full w-10 h-10 flex items-center justify-center"
                  onPress={handleGoToPreviousImage}
                >
                  <ButtonIcon as={ChevronRight} className="text-white" size="sm" />
                </Button>

                <Button
                  className="bg-blue-500 absolute top-1/2 left-2 rounded-full w-10 h-10 flex items-center justify-center"
                  onPress={handleGoToNextImage}
                >
                  <ButtonIcon as={ChevronLeft} className="text-white" size="sm" />
                </Button>
              </Box>
            )}

            <VStack className="space-y-2">
              <Text className="text-gray-500">Status</Text>
              <Box className={`px-3 py-1 rounded-full self-start ${getStatusColor(occurrence.status)}`}>
                <Text className="text-white text-sm">{getStatusText(occurrence.status)}</Text>
              </Box>
            </VStack>

            <VStack className="space-y-2">
              <Text className="text-gray-500">Descrição</Text>
              <Text className="text-gray-800">{occurrence.description}</Text>
            </VStack>

            <VStack className="space-y-2">
              <Text className="text-gray-500">Data</Text>
              <Text className="text-gray-800">{formatDate(occurrence.dateTime)}</Text>
            </VStack>

            <VStack className="space-y-2">
              <Text className="text-gray-500">Localização</Text>
              <HStack className="items-center space-x-2">
                <Icon as={MapPin} className="text-gray-500" size="sm" />
                <Text className="text-gray-800">{formatLocation(occurrence.location)}</Text>
              </HStack>
            </VStack>

            {occurrence.status === "CLOSED" && occurrence.feedback && (
              <VStack className="space-y-2">
                <Text className="text-gray-500">Feedback</Text>
                <Box className="bg-gray-100 p-3 rounded-lg">
                  <Text className="text-gray-800">{occurrence.feedback}</Text>
                </Box>
              </VStack>
            )}

            {occurrence.status === "OPEN" && (
              <Button
                className="bg-blue-500 mt-2"
                onPress={() => handleStartProcess(occurrence.id)}
                isDisabled={processingId === occurrence.id}
              >
                {processingId === occurrence.id ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <ButtonIcon as={PlayCircle} className="text-white mr-2" size="sm" />
                    <ButtonText className="text-white">Iniciar</ButtonText>
                  </>
                )}
              </Button>
            )}

            {occurrence.status === "IN_PROGRESS" && (
              <VStack className="space-y-2 mt-2">
                <Text className="text-gray-500">Feedback</Text>
                <Textarea>
                  <TextareaInput
                    placeholder="Descreva as ações tomadas e o resultado..."
                    value={feedback[occurrence.id] || ""}
                    onChangeText={(text) => setFeedback({ ...feedback, [occurrence.id]: text })}
                    numberOfLines={4}
                  />
                </Textarea>
                <Button
                  className="bg-green-500 mt-2"
                  onPress={() => handleSubmitFeedback(occurrence.id)}
                  isDisabled={processingId === occurrence.id}
                >
                  {processingId === occurrence.id ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text className="text-white">Fechar Denúncia</Text>
                  )}
                </Button>
              </VStack>
            )}
          </VStack>
        )}
      </VStack>
    </Pressable>
  )
}