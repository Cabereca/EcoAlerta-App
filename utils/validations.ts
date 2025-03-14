import { z } from 'zod';

const isValidPhone = (telefone: string) => {
  const phoneValidate = /^(\+\d{1,2}\s?)?(\()?\d{2,4}(\))?\s?(\d{4,5}(-|\s)?\d{4})$/;
  const isValid = phoneValidate.test(telefone);
  return isValid;
}

//  Função para validar o numero de registro
const isValidRegistrationNumber = (registrationNumber: string) => {
  const registrationNumberValidate = /^[0-9.-]+$/;
  const isValid = registrationNumberValidate.test(registrationNumber);
  return isValid;
}

export const adminLoginValidationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const adminRegisterValidationSchema = z.object({
  registrationNumber: z.string().min(3).max(18).refine(data => isValidRegistrationNumber(data), { message: 'Invalid registration number' }),
  name: z.string().min(3).max(255).refine(data => Boolean(data), { message: 'The name is mandatory' }),
  email: z.string().email({ message: 'Invalid email address' }).refine(data => Boolean(data), { message: 'The email is mandatory' }),
  phone: z.string().refine(data => isValidPhone(data), { message: 'Invalid telephone number' }),
  password: z.string().min(8).refine(data => Boolean(data), { message: 'The password is mandatory' }),
  confirmPassword: z.string().min(6),
}, {
  required_error: 'Campo obrigatório',
  invalid_type_error: 'Tipo inválido'
}).refine(data => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
});

export const userLoginValidationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const userRegisterValidationSchema = z.object({
  cpf: z.string().min(11).max(11).refine(data => Boolean(data), { message: 'The CPF is mandatory' }),
  name: z.string().min(3).max(255).refine(data => Boolean(data), { message: 'The name is mandatory' }),
  email: z.string().email({ message: 'Invalid email address' }).refine(data => Boolean(data), { message: 'The email is mandatory' }),
  phone: z.string().refine(data => isValidPhone(data), { message: 'Invalid telephone number' }),
  password: z.string().min(8).refine(data => Boolean(data), { message: 'The password is mandatory' }),
  confirmPassword: z.string().min(6),
}, {
  required_error: 'Campo obrigatório',
  invalid_type_error: 'Tipo inválido'
}).refine(data => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
});

export const occurrenceCreateValidationSchema = z.object({
  title: z.string().min(3, { message: "O título deve ter pelo menos 3 caracteres" }),
  description: z.string().min(10, { message: "A descrição deve ter pelo menos 10 caracteres" }),
  dateTime: z.date(),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
  })
});

export const userEditValidationSchema = z.object({
  name: z.string({message: "O nome é obrigatório"}).min(3, { message: "O nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "O email é obrigatório" }),
  phone: z.string().refine(data => isValidPhone(data), { message: 'Invalid telephone number' }),
})
