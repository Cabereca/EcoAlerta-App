import Leaf from '@/assets/images/big-leaf.png';
import SplashScreenPage from '@/components/SplashScreen';
import { Text } from '@/components/Themed';
import { Box } from '@/components/ui/box';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import { Input, InputField } from '@/components/ui/input';
import { Toast, ToastDescription, ToastTitle, useToast } from '@/components/ui/toast';
import { useUserAuth } from '@/hooks/useAuth';
import api from '@/services/api';
import { userLoginValidationSchema } from '@/utils/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

type FieldValues = {
  email: string;
  password: string;
}

export default function HomePage () {
  const [isShowSplash, setIsShowSplash] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toast = useToast();

  const { control, handleSubmit, formState: { errors } } = useForm<FieldValues>({
    resolver: zodResolver(userLoginValidationSchema)
  });

  const { login } = useUserAuth();

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {

      const res = await api.post('/userLogin', data);

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


  useEffect(() => {
    setTimeout(() => {
      setIsShowSplash(false);
    }, 3000);
  }, []);

  return (
    isShowSplash ? <SplashScreenPage /> : (
      <Box className='w-full h-screen flex items-center justify-center'>
        <Box className='w-full h-screen flex items-center justify-center max-w-md p-16 bg-white rounded-lg shadow-lg'>
          <Image source={Leaf} alt='Folha' className='mb-12 w-[138px] h-[138px] mx-auto'/>

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

          <Link href="/admin/login" style={{ color: 'gray'}} className='mt-8 text-sm'>Sou administrador</Link>

          <Text className='mt-8 text-center'>
            Ainda não tem uma conta?
            <Link href="/(tabs)/registro" style={{ color: 'green'}} className='mt-8'>Cadastre-se</Link>
          </Text>
        </Box>
      </Box>
    )
  )
}
