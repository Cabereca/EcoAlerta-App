import { z } from 'zod';

export const adminLoginValidationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
