"use client"

import { Occurrence } from '@/@types/Occurrence'
import Leaf from '@/assets/images/big-leaf.png'
import OccurrenceCard from '@/components/OccurrenceCard'
import { FlatList } from '@/components/Themed'
import { Avatar } from '@/components/ui/avatar'
import { Box } from '@/components/ui/box'
import { Center } from '@/components/ui/center'
import { Heading } from '@/components/ui/heading'
import { HStack } from '@/components/ui/hstack'
import { Icon } from '@/components/ui/icon'
import api from '@/services/api'
import { Link, useNavigation } from 'expo-router'
import { Plus, User } from "lucide-react-native"
import { useEffect, useState } from "react"
import { ActivityIndicator, Image, Pressable } from "react-native"

import React from 'react'

export default function OccurrencesScreen() {
  const navigation = useNavigation()
  const [occurrences, setOccurrences] = useState<Occurrence[] | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    (async () => {
      await fetchOccurrences()
    }
    )()
  }, [])

  const fetchOccurrences = async () => {
    try {
      const res = await api.get<Occurrence[]>(`/occurrence/all`)
      setOccurrences(res.data)
    } catch (error) {
      console.error("Error fetching occurrences:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    fetchOccurrences()
  }

  if (loading && !refreshing) {
    return (
      <Center className='flex-1 bg-green-50'>
        <ActivityIndicator size="large" color="#22c55e" />
      </Center>
    )
  }

  return (
    <Box className='flex-1 bg-green-50 mx-auto w-full'>
      <HStack className='p-4 justify-between items-center'>
        <HStack className='flex-1 items-center'>
          <Box className='w-12 h-12 bg-green-50 rounded-full justify-center items-center'>
            <Image source={Leaf} alt='Folha' style={{ width: 30, height: 30 }} />
          </Box>
          <Heading size="md">Todas as denúncias</Heading>
        </HStack>
        <HStack className='items-center'>
          <Link href="/user/profile">
            <Avatar size="sm" className='border border-gray-300'>
              <Icon as={User} size="sm" />
            </Avatar>
          </Link>
        </HStack>
      </HStack>

      {
        occurrences && occurrences.length > 0 ? (
          <FlatList
            data={occurrences}
            renderItem={({ item }) => <OccurrenceCard occurrence={item} />}
            keyExtractor={(item) => item?.id}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            key={occurrences.length}
          />
        ) : (
          <Center className='flex-1'>
            <Heading size="md">Nenhuma denúncia encontrada - {occurrences?.length}</Heading>
          </Center>
        )
      }


      <Pressable className='absolute right-5 bottom-5 bg-green-500 p-6 rounded-full' onPress={() => navigation.navigate('novaOcorrencia')}>
        <Icon as={Plus} size="xl" color="white" />
      </Pressable>
    </Box>
  )
}
