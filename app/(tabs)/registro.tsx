
import { UserCreate } from '@/@types/User';
import Leaf from '@/assets/images/big-leaf.png';
import { Text } from '@/components/Themed';
import { Box } from '@/components/ui/box';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Image } from '@/components/ui/image';
import { Input, InputField } from '@/components/ui/input';
import { Toast, ToastDescription, ToastTitle, useToast } from '@/components/ui/toast';
import { useUserAuth } from '@/hooks/useAuth';
import api from '@/services/api';
import { userRegisterValidationSchema } from '@/utils/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ScrollView } from 'react-native';

type FieldValues = UserCreate & {
  confirmPassword: string;
}

export default function UserRegistro() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toast = useToast();

  const { control, handleSubmit, formState: { errors } } = useForm<FieldValues>({
    resolver: zodResolver(userRegisterValidationSchema)
  });

  const { login } = useUserAuth();

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const res = await api.post('/users', data);

      toast.show({
        id: Math.random().toString(),
        placement: "top right",
        duration: 3000,
        render: ({ id }) => {
          const uniqueToastId = "toast-" + id
          return (
            <Toast nativeID={uniqueToastId} action="success" variant="solid">
              <ToastTitle>Registro efetuado com sucesso!!!</ToastTitle>
              <ToastDescription>
                Seja bem-vindo
              </ToastDescription>
            </Toast>
          )
        },
      });

      const {token, user} = res.data;

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
              <ToastTitle>Erro ao cadastrar admin!!!</ToastTitle>
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
    <Box className='w-screen flex items-center justify-center bg-white'>
      <ScrollView contentContainerStyle={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
      }} className='w-full max-w-md rounded-lg shadow-lg'
      >
        <Image source={Leaf} alt='Folha' className='mb-12 w-[138px] h-[138px] mx-auto'/>

        <Heading className='text-center text-4xl mb-12'>Criar conta</Heading>

        <Box className='w-full min-h-screen flex flex-col gap-8'>
        <Controller
          control={control}
          rules={{
          required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input>
              <InputField
                placeholder="Nome completo"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            </Input>

          )}
          name="name"
          />
          {errors.name && <Text style={{color: 'red'}}>{errors.name.message}</Text>}

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
                placeholder="CPF"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            </Input>

          )}
          name="cpf"
          />
          {errors.cpf && <Text style={{color: 'red'}}>{errors.cpf.message}</Text>}

          <Controller
          control={control}
          rules={{
          required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input>
              <InputField
                placeholder="Telefone"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            </Input>

          )}
          name="phone"
          />
          {errors.phone && <Text style={{color: 'red'}}>{errors.phone.message}</Text>}

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

          <Controller
          control={control}
          rules={{
          required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input>
              <InputField
                placeholder="Confirmar senha"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                type='password'
              />
            </Input>

          )}
          name="confirmPassword"
          />
          {errors.confirmPassword && <Text style={{color: 'red'}}>{errors.confirmPassword.message}</Text>}

          <Button  onPress={handleSubmit(onSubmit)} style={{ backgroundColor: '#00B603' }}>
            {
              isSubmitting ?
                <ButtonSpinner /> :

                <ButtonText style={{ color: '#FFFFFF' }}>Cadastrar</ButtonText>
            }
          </Button>
        </Box>

        <Text className='text-center'>
          Já possui uma conta?
          <Link href="/(tabs)" style={{ color: 'green'}} className='ml-4 text-sm underline'>
            Faça login
          </Link>
        </Text>
      </ScrollView>
    </Box>
  );
}
