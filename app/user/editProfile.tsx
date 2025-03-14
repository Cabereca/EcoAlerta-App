import { Text } from '@/components/Themed';
import { Box } from '@/components/ui/box';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Input, InputField } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import { useUserAuth } from '@/hooks/useAuth';
import api from '@/services/api';
import { userEditValidationSchema } from '@/utils/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { Controller, useForm } from 'react-hook-form';

type FieldValues = {
  name: string;
  email: string;
  phone: string;
}

export default function EditProfilePage() {
  const { user } = useUserAuth()
  const toast = useToast()
  const navigation = useNavigation()

  const handleGoBack = () => {
    navigation.goBack()
  }

  const { control, handleSubmit, formState: { errors } } = useForm<FieldValues>({
      resolver: zodResolver(userEditValidationSchema)
  });

  const onSubmit = async (data: FieldValues) => {
    try {
      await api.put(`/user/${user?.id}`, data);
      navigation.goBack();
    } catch (error) {
      toast.show({
        render: () => (
          <Box>
            <Text>Erro ao tentar salvar as informações</Text>
          </Box>
        )
      })
    }
  }

  return (
    <Box className='flex-1 bg-white'>
      <Button variant='link' onPress={handleGoBack} className='flex items-center justify-start'>
        <ButtonIcon as={ArrowLeft} />
        <ButtonText>Voltar</ButtonText>
      </Button>
      <Heading className='w-full text-center'>Alterar informações</Heading>

      <Box className='p-8 space-y-2'>
        <Text>Nome</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input className='mb-2'>
              <InputField
                onChange={onChange}
                onBlur={onBlur}
                value={value}
              />
            </Input>
          )}
          name="name"
          defaultValue={user?.name}
        />

        <Text>Email</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input className='mb-2'>
              <InputField
                onChange={onChange}
                onBlur={onBlur}
                value={value}

              />
            </Input>
          )}
          name="email"
          defaultValue={user?.email}
        />

        <Text>Telefone</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input className='mb-4'>
              <InputField
                onChange={onChange}
                onBlur={onBlur}
                value={value}

              />
            </Input>
          )}
          name="phone"
          defaultValue={user?.phone}
        />

        <Button onPress={handleSubmit(onSubmit)} className='bg-green-500'>
          <ButtonText>Salvar</ButtonText>
        </Button>
      </Box>
    </Box>
  )
}
