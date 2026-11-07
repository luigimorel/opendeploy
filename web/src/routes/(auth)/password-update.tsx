import { PasswordUpdatePage } from '@/pages/auth/password-update';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(auth)/password-update')({
  component: PasswordUpdatePage,
});
