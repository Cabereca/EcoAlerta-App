import Leaf from '@/assets/images/big-leaf.png';
import { Text } from '@/components/Themed';
import { Box } from '@/components/ui/box';
import { Button, ButtonIcon, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Image } from '@/components/ui/image';
import { Input, InputField } from '@/components/ui/input';
import { Toast, ToastDescription, ToastTitle, useToast } from '@/components/ui/toast';
import { useAdminAuth } from '@/hooks/useAuth';
import api from '@/services/api';
import { adminLoginValidationSchema } from '@/utils/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

type FieldValues = {
  email: string;
  password: string;
}

export default function AdminLogin() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toast = useToast();

  const { control, handleSubmit, formState: { errors } } = useForm<FieldValues>({
    resolver: zodResolver(adminLoginValidationSchema)
  });

  const { login } = useAdminAuth();

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const res = await api.post('/employeeLogin', data);

      toast.show({
        id: Math.random().toString(),
        placement: "top right",
        duration: 3000,
        render: ({ id }) => {
          const uniqueToastId = "toast-" + id
          return (
            <Toast nativeID={uniqueToastId} action="success" variant="solid">
              <ToastTitle>Login efetuado com sucesso!!!</ToastTitle>
              <ToastDescription>
                Seja bem-vindo
              </ToastDescription>
            </Toast>
          )
        },
      });

      const { token, user } = res.data;


      login(user, token);
    } catch (error: any) {
      console.error(error.response.data.message);
      toast.show({
        id: Math.random().toString(),
        placement: "top right",
        duration: 3000,
        render: ({ id }) => {
          const uniqueToastId = "toast-" + id
          return (
            <Toast nativeID={uniqueToastId} action="error" variant="solid">
              <ToastTitle>Erro ao efetuar login!!!</ToastTitle>
              <ToastDescription>
                {error.response.data.message}
              </ToastDescription>
            </Toast>
          )
        },
      })
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Box className='w-full h-screen flex items-center justify-center'>
      <Box className='relative w-full h-screen flex items-center justify-center max-w-md p-16 bg-white rounded-lg shadow-lg'>
        <Box className='absolute top-4 left-4'>
          <Button onPress={() => router.navigate("/(tabs)")} variant='link'>
            <ButtonIcon as={ChevronLeft} />
            <ButtonText>Voltar</ButtonText>
          </Button>
        </Box>
        <Image source={Leaf} alt='Folha' className='mb-12 w-[138px] h-[138px] mx-auto'/>

        <Heading className='text-center text-2xl mb-12'>Administrador</Heading>

        <Box className='w-full flex flex-col gap-8'>
          <Controller
          control={control}
          rules={{
          required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input>
              <InputField
                placeholder="Email"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            </Input>

          )}
          name="email"
          />
          {errors.email && <Text style={{color: 'red'}}>{errors.email.message}</Text>}

          <Controller
          control={control}
          rules={{
          required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input>
              <InputField
                placeholder="Senha"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                type='password'
              />
            </Input>

          )}
          name="password"
          />
          {errors.password && <Text style={{color: 'red'}}>{errors.password.message}</Text>}

          <Button  onPress={handleSubmit(onSubmit)} style={{ backgroundColor: '#00B603' }}>
            {
              isSubmitting ?
                <ButtonSpinner /> :

                <ButtonText style={{ color: '#FFFFFF' }}>Entrar</ButtonText>
            }
          </Button>
        </Box>

        <Link href="/admin/registro" style={{ color: 'gray'}} className='mt-8 text-sm'>Registrar Administrador</Link>
      </Box>
    </Box>
  );
}
