import { z } from 'zod';

const emailSchema = z.string().trim().email('Enter a valid email address.');
const newPasswordSchema = z.string().min(8, 'Use at least 8 characters.');

export const signUpSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(2, 'Use at least 2 characters.')
      .max(32, 'Use no more than 32 characters.')
      .regex(/^[a-zA-Z0-9_-]+$/, 'Use letters, numbers, hyphens, or underscores.'),
    email: emailSchema,
    password: newPasswordSchema,
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match.',
  });

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Enter your password.'),
});

export const passwordResetSchema = z.object({
  email: emailSchema,
});

export const passwordUpdateSchema = z
  .object({
    password: newPasswordSchema,
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match.',
  });
