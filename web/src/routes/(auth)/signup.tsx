import { SignUpPage } from '@/pages/auth/sign-up';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(auth)/signup')({
  component: SignUpPage,
});
