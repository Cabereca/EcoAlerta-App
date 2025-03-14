"use client"

import type { Occurrence } from "@/@types/Occurrence"
import { Text } from "@/components/Themed"
import { Box } from "@/components/ui/box"
import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { HStack } from "@/components/ui/hstack"
import { Icon } from "@/components/ui/icon"
import { Input, InputField } from "@/components/ui/input"
import { Textarea, TextareaInput } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/toast"
import { VStack } from "@/components/ui/vstack"
import api from '@/services/api'
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigation, useRoute } from "@react-navigation/native"
import { ArrowLeft } from "lucide-react-native"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { Pressable, ScrollView } from "react-native"
import * as z from "zod"

// Define the schema for form validation
const schema = z.object({
  title: z.string().min(3, { message: "O título deve ter pelo menos 3 caracteres" }),
  description: z.string().min(10, { message: "A descrição deve ter pelo menos 10 caracteres" }),
})

type FormData = z.infer<typeof schema>

export default function EditOccurrenceScreen() {
  const navigation = useNavigation()
  const route = useRoute()
  const toast = useToast()
  const { id } = route.params as { id: string }
  const [occurrence, setOccurrence] = useState<Occurrence | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: occurrence?.title || "",
      description: occurrence?.description || "",
    },
  })

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get<Occurrence>(`/occurrence/${id}`)
        setOccurrence(data)
        reset({
          title: data.title,
          description: data.description,
        })
      } catch (error) {
        toast.show({
          render: () => (
            <Box className="bg-red-500 p-4 rounded-lg">
              <Text style={{ color: "white" }}>Erro ao carregar a denúncia.</Text>
            </Box>
          )
        })
        navigation.goBack()
      }
    })()
  }, [])

  const onSubmit = async (data: FormData) => {
    if (isSubmitting) return
    setIsSubmitting(true)

    try {
      await api.put(`/occurrence/${id}`, data);

      toast.show({
        render: () => (
          <Box className="bg-green-500 p-4 rounded-lg">
            <Text style={{ color: "white" }}>Denúncia atualizada com sucesso!</Text>
          </Box>
        )
      })
      navigation.goBack()
    } catch (error) {
      toast.show({
        render: () => (
          <Box className="bg-red-500 p-4 rounded-lg">
            <Text style={{ color: "white" }}>Erro ao atualizar a denúncia. Tente novamente mais tarde.</Text>
          </Box>
        )
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Box className="flex-1 bg-gray-50">
      <HStack className="bg-white p-4 items-center border-b border-gray-200">
        <Pressable onPress={() => navigation.goBack()} className="mr-4">
          <Icon as={ArrowLeft} className="text-gray-800" size="md" />
        </Pressable>
        <Heading className="text-gray-800 text-lg">Editar denúncia</Heading>
      </HStack>

      <ScrollView className="p-4">
        <VStack className="space-y-4">
          <VStack className="space-y-2 mb-2">
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
            {errors.title && <Text className="text-red-500">{errors.title.message}</Text>}
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
            {errors.description && <Text className="text-red-500">{errors.description.message}</Text>}
          </VStack>

          <Button className="mt-4 bg-green-500" onPress={handleSubmit(onSubmit)} isDisabled={isSubmitting}>
            <Text style={{color: 'white'}} className="font-medium">{isSubmitting ? "Salvando..." : "Salvar alterações"}</Text>
          </Button>
        </VStack>
      </ScrollView>
    </Box>
  )
}

