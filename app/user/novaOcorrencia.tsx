"use client"
import { Text } from "@/components/Themed"
import { Box } from "@/components/ui/box"
import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { HStack } from "@/components/ui/hstack"
import { Icon } from "@/components/ui/icon"
import { Input, InputField } from "@/components/ui/input"
import { Textarea, TextareaInput } from "@/components/ui/textarea"
import { Toast, ToastDescription, ToastTitle, useToast } from "@/components/ui/toast"
import { VStack } from "@/components/ui/vstack"
import { useUserAuth } from '@/hooks/useAuth'
import api from '@/services/api'
import { occurrenceCreateValidationSchema } from '@/utils/validations'
import { zodResolver } from "@hookform/resolvers/zod"
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker'
import { useNavigation } from "@react-navigation/native"
import dayjs from 'dayjs'
import * as ImagePicker from "expo-image-picker"
import { Camera } from "lucide-react-native"
import { useRef, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { Image, Platform, Pressable, ScrollView, StyleSheet } from "react-native"
import MapView, { Marker } from "react-native-maps"
import * as z from "zod"

type FormData = z.infer<typeof occurrenceCreateValidationSchema>

export default function NewOccurrenceScreen() {
  const { user } = useUserAuth()
  const navigation = useNavigation()
  const toast = useToast()
  const {
    setValue,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(occurrenceCreateValidationSchema),
  })
  const [images, setImages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [marker, setMarker] = useState<{ latitude: number; longitude: number } | null>(null)
  const mapRef = useRef<MapView>(null)

  const onSubmit = async (data: FormData) => {
    if (isSubmitting) return
    setIsSubmitting(true)

    try {
      // Create FormData
      const formData = new FormData()
      formData.append("title", data.title)
      formData.append("description", data.description)
      formData.append("status", "OPEN")
      formData.append("dateTime", new Date().toISOString())
      formData.append("location", `${data.location.latitude} ${data.location.longitude}`)
      formData.append("userId", user?.id || "")
      // Append images
      images.forEach((image, index) => {
        formData.append("images", {
          uri: image,
          type: "image/jpeg",
          name: `image_${index}.jpg`,
        } as any)
      })

      // Submit to API
      await api.post("/occurrence", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // if (!response.ok) throw new Error('Falha ao enviar a denúncia')

      // For demo, just log and navigate back
      console.log("Submitted:", formData)

      toast.show({
        id: Math.random().toString(),
        placement: "top right",
        duration: 3000,
        render: ({ id }) => {
          const uniqueToastId = "toast-" + id
          return (
            <Toast nativeID={uniqueToastId} action="success" variant="solid">
              <ToastTitle>Denúnia efetuada com sucesso!</ToastTitle>
              <ToastDescription>
                Sua denúncia foi enviada com sucesso e será analisada.
              </ToastDescription>
            </Toast>
          )
        },
      })
      navigation.goBack()
    } catch (error: any) {
      console.error(error.message)
      toast.show({
        id: Math.random().toString(),
        placement: "top right",
        duration: 3000,
        render: ({ id }) => {
          const uniqueToastId = "toast-" + id
          return (
            <Toast nativeID={uniqueToastId} action="warning" variant="solid">
              <ToastTitle>{error.response.data.message}</ToastTitle>
            </Toast>
          )
        },
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddImage = async () => {
    try {
      // Request permissions
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== "granted") {
          toast.show({
            id: Math.random().toString(),
            placement: "top right",
            duration: 3000,
            render: ({ id }) => {
              const uniqueToastId = "toast-" + id
              return (
                <Toast nativeID={uniqueToastId} action="warning" variant="solid">
                  <ToastTitle>Precisamos de autorização para ver suas fotos!</ToastTitle>
                </Toast>
              )
            },
          })
          return
        }
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      })

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImages((prev) => [...prev, result.assets[0].uri])
      }
    } catch (error) {
      console.error("Error picking image:", error)
      toast.show({
        id: Math.random().toString(),
        placement: "top right",
        duration: 3000,
        render: ({ id }) => {
          const uniqueToastId = "toast-" + id
          return (
            <Toast nativeID={uniqueToastId} action="warning" variant="solid">
              <ToastTitle>Erro ao selecionar imagem!</ToastTitle>
            </Toast>
          )
        },
      })
    }
  }

  return (
    <Box className="flex-1 bg-green-50">
      <HStack className="bg-green-500 p-4 items-center">
        <Heading className="text-white text-lg">Nova Denúncia</Heading>
      </HStack>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <VStack className="space-y-8 p-4">
          <VStack className="space-y-2 mb-4">
            <Text className="font-medium">Título</Text>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input>
                  <InputField
                    placeholder="Título da ocorrência"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                </Input>
              )}
              name="title"
            />
            {errors.title && <Text style={{ color: 'red' }}>{errors.title.message}</Text>}
          </VStack>

          <VStack className="space-y-2 mb-4">
            <Text className="font-medium">Descrição</Text>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Textarea>
                  <TextareaInput
                    placeholder="Descreva a ocorrência em detalhes"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    numberOfLines={4}
                  />
                </Textarea>
              )}
              name="description"
            />
            {errors.description && <Text style={{ color: 'red' }}>{errors.description.message}</Text>}
          </VStack>

          <VStack className="space-y-2 mb-4">
            <Text className="font-medium">Data e Hora</Text>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input>
                  <InputField
                    placeholder="Data e hora da ocorrência"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    readOnly={true}
                    onPress={() => {
                      DateTimePickerAndroid.open({
                        mode: 'date',
                        value: control._formValues.dateTime || new Date(),
                        onChange: (event, date) => {
                          if (event.type === 'set') {
                            onChange(date)
                          }
                        }
                      })
                    }}
                    value={dayjs(value).format('DD/MM/YYYY')}
                    className='w-4/5'
                  />
                  <InputField
                    placeholder="Data e hora da ocorrência"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    readOnly={true}
                    onPress={() => {
                      DateTimePickerAndroid.open({
                        mode: 'time',
                        value: control._formValues.dateTime || new Date(),
                        onChange: (event, date) => {
                          if (event.type === 'set') {
                            onChange(date)
                          }
                        }
                      })
                    }}
                    value={dayjs(value).format('HH:mm')}
                  />
                </Input>
              )}
              name="dateTime"
            />
            {errors.dateTime && <Text style={{ color: 'red' }}>{errors.dateTime.message}</Text>}
          </VStack>

          <VStack className="space-y-2">
            <Text className="font-medium">Imagens</Text>
            <HStack className="flex-wrap">
              {images.map((image, index) => (
                <Box key={index} className="w-1/3 aspect-square bg-gray-100 rounded-md overflow-hidden m-1">
                  <Image source={{ uri: image }} style={styles.image} />
                </Box>
              ))}
              <Pressable
                className="w-1/3 aspect-square bg-gray-100 rounded-md justify-center items-center m-1"
                onPress={handleAddImage}
              >
                <Icon as={Camera} className="text-gray-500" size="md" />
              </Pressable>
            </HStack>
          </VStack>

          <VStack className="space-y-2">
            <Text className="font-medium">Localização</Text>
            <MapView
              ref={mapRef}
              style={styles.map}
              initialRegion={{
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              onPress={(e) => {
                setMarker(e.nativeEvent.coordinate);
                setValue("location", e.nativeEvent.coordinate);
                mapRef.current?.animateToRegion({
                  ...e.nativeEvent.coordinate,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                });
              }}
            >
              {marker && (
                <Marker
                  coordinate={{
                    latitude: marker.latitude,
                    longitude: marker.longitude,
                  }}
                  title="Local da ocorrência"
                  description="Clique para selecionar"
                />
              )}
            </MapView>
          </VStack>

          <Button className="mt-6 bg-green-500" onPress={handleSubmit(onSubmit)} isDisabled={isSubmitting}>
            <Text style={{ color: "white" }} className="font-medium">
              {isSubmitting ? "Enviando..." : "Enviar Denúncia"}
            </Text>
          </Button>
        </VStack>
      </ScrollView>
    </Box>
  )
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  map: {
    height: 200,
    width: "100%",
  },
})

