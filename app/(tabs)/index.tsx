
import { Box } from '@/components/ui/box';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { FormControl, FormControlLabel, FormControlLabelText } from '@/components/ui/form-control';
import { Heading } from '@/components/ui/heading';
import { Input, InputField } from '@/components/ui/input';
import { adminLoginValidationSchema } from '@/utils/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

type FieldValues = {
  email: string;
  password: string;
}

export default function TabOneScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { handleSubmit, register, formState: { errors } } = useForm<FieldValues>({
    resolver: zodResolver(adminLoginValidationSchema)
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setTimeout(() => {

    }, 3000);
    try {
      console.log('a')
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Box className='w-full h-screen flex items-center justify-center'>
      <Box className='w-full h-screen flex items-center justify-center max-w-md p-16 bg-white rounded-lg shadow-lg'>
        <Box className='mb-12 w-[138px] h-[138px] bg-gray-100 mx-auto'>
        </Box>

        <Heading className='text-center text-2xl mb-12'>Administrador</Heading>

        <Box className='w-full flex flex-col gap-8'>
          <FormControl
            size="lg"
            isDisabled={false}
            isInvalid={false}
            isReadOnly={false}
          >
            <FormControlLabel>
              <FormControlLabelText>Email</FormControlLabelText>
            </FormControlLabel>
            <Input size='xl'>
              <InputField placeholder=''  {...register('email')} />
            </Input>
          </FormControl>

          <FormControl
            size="lg"
            isDisabled={false}
            isInvalid={false}
            isReadOnly={false}
          >
            <FormControlLabel>
              <FormControlLabelText>Senba</FormControlLabelText>
            </FormControlLabel>
            <Input size='xl'>
              <InputField placeholder='' type={showPassword ? 'text' : 'password'} {...register('password')} />

            </Input>
          </FormControl>

          <Button  onPress={onSubmit} style={{ backgroundColor: '#00B603' }}>
            {
              isSubmitting ?
                <ButtonSpinner /> :

                <ButtonText style={{ color: '#FFFFFF' }}>Entrar</ButtonText>
            }
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
