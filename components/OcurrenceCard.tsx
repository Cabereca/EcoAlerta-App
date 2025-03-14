import { Occurrence } from '@/@types/Occurrence'
import api from '@/services/api'
import geoCodeApi from '@/services/geoCode'
import dayjs from 'dayjs'
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from 'lucide-react-native'
import { useState } from 'react'
import { GestureResponderEvent } from 'react-native'
import { Text } from './Themed'
import { Box } from './ui/box'
import { Button, ButtonText } from './ui/button'
import { Card } from './ui/card'
import { Heading } from './ui/heading'
import { Image } from './ui/image'

interface OccurrenceCardProps {
  occurrence: Occurrence
}

export default function OccurrenceCard({ occurrence }: OccurrenceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const handlePreviousImage = (e: GestureResponderEvent) => {
    e.stopPropagation()
    if (!occurrence.images) return;
    if (occurrence.images?.length <= 1) return

    setCurrentImageIndex((prev) => (prev === 0 ? (occurrence.images ? occurrence.images.length - 1 : 0) : prev - 1))
  }

  const handleNextImage = (e: GestureResponderEvent) => {
    e.stopPropagation()
    if (!occurrence.images) return;
    if (occurrence.images?.length <= 1) return

    setCurrentImageIndex((prev) => (prev === (occurrence.images ? occurrence.images.length - 1 : 0) ? 0 : prev + 1))
  }

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev)
  }

  const handleGetAddress = (location: { lat: number, lng: number }) => {
    if (!location) return "Localização não informada"

    geoCodeApi.get(`/reverse?format=jsonv2&lat=${location.lat}&lon=${location.lng}`)
      .then((response) => {
        const { address } = response.data
        return `${address.road} - ${address.city}, ${address.state}`
      })
      .catch((error) => {
        console.error(error.response.data.error.message)
        return `Endereço não encontrado para a localização informada (${location.lat}, ${location.lng})`
      })

    return `Endereço não encontrado para a localização informada (${location.lat}, ${location.lng})`
  }

  const getStatusLabel = (status: Occurrence["status"]) => {
    switch (status) {
      case "OPEN":
        return { label: "Aberta", color: "green" }
      case "IN_PROGRESS":
        return { label: "Em Progresso", color: "yellow" }
      case "CLOSED":
        return { label: "Fechada", color: "red" }
      default:
        return { label: "Desconhecido", color: "gray" }
    }
  }

  const statusInfo = getStatusLabel(occurrence.status);

  const handleGetImage = (path: string) => {
    return `${api.defaults.baseURL}/images/${path}`
  }

  return (
    occurrence && <Card className="w-full max-w-md bg-black text-white rounded-xl overflow-hidden mb-4" onTouchStart={toggleExpand} key={occurrence.id}>
      <Box className="relative">
        {occurrence.images && occurrence.images.length > 0 ? (
          <Box className="relative aspect-square bg-red-200">
            <Image
              source={{
                uri: handleGetImage(occurrence.images[currentImageIndex].path),
              }}
              alt={occurrence.title}
              className="w-full h-full object-cover"
            />

            {/* Navigation buttons */}
            <Button
              onPress={handlePreviousImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-green-500 rounded-full p-1 text-white"
              aria-label="Imagem anterior"
            >
              <ButtonText>
                <ChevronLeft color="white" className="h-5 w-5" />
              </ButtonText>
            </Button>

            <Button
              onPress={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-green-500 rounded-full p-1 text-white"
              aria-label="Próxima imagem"
            >
              <ButtonText>
                <ChevronRight color="white" className="h-5 w-5" />
              </ButtonText>
            </Button>
          </Box>
        ) : (
          <Box className="aspect-square bg-gray-200" />
        )}
      </Box>

      <Box className="p-3">
        <Box className="w-full flex flex-row justify-between items-center">
          <Box className='flex flex-col items-start'>
            <Heading size='lg' className="font-medium" style={{ color: 'white' }}>{occurrence.title}</Heading>
            <Text className="text-lg" style={{ color: 'white' }}>{dayjs(occurrence.dateTime).format("DD/MM/YYYY")}</Text>
          </Box>
          <Button
            onPress={toggleExpand}
            aria-label={isExpanded ? "Recolher detalhes" : "Expandir detalhes"}
            className='rounded-full p-2'
          >
            <ButtonText style={{ color: 'white' }}>
              {isExpanded ? <ChevronUp color='white' className="h-5 w-5" /> : <ChevronDown color="white" className="h-5 w-5" />}
            </ButtonText>
          </Button>
        </Box>

        {isExpanded && (
          <Box className="mt-3 space-y-2">
            <Text className="text-sm" style={{ color: 'white' }}>{occurrence.description}</Text>
            <Text className="text-sm" style={{ color: 'white' }}>{handleGetAddress(occurrence.location)}</Text>
            <Box className="flex flex-row gap-4 items-center space-x-2">
              <Text
                className={`inline-block w-2 h-2 rounded-full bg-${occurrence.status === "OPEN" ? "green" : occurrence.status === "IN_PROGRESS" ? "yellow" : "red"}-500`}
              ></Text>
              <Text className={`text-sm`} style={{ color: 'white' }}>{statusInfo.label}</Text>
            </Box>
          </Box>
        )}
      </Box>
    </Card>
  )
}
