import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import * as React from 'react';

import { AuthFieldError, AuthFormMessage, AuthLayout } from '@/components/auth-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { passwordUpdateSchema } from '@/lib/auth-schemas';

type PasswordUpdateValues = z.infer<typeof passwordUpdateSchema>;

export function PasswordUpdatePage() {
  const [notice, setNotice] = React.useState<React.ReactNode>(null);
  const form = useForm<PasswordUpdateValues>({
    resolver: zodResolver(passwordUpdateSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  return (
    <AuthLayout
      eyebrow="Set a new password"
      title="Update your password"
      description="Choose a new password for your Open Deploy account."
      footer={
        <>
          Need a reset link?{' '}
          <Link className="text-primary font-medium underline-offset-4 hover:underline" to="/password-reset">
            Request a password reset
          </Link>
        </>
      }>
      <form
        className="mt-7 space-y-4"
        noValidate
        onSubmit={form.handleSubmit(() =>
          setNotice('Password updates are not connected to the server yet. Your password was not changed.'),
        )}>
        <div className="space-y-2">
          <Label htmlFor="password">New password</Label>
          <Input
            id="password"
            {...form.register('password')}
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            aria-invalid={!!form.formState.errors.password}
            aria-describedby="password-error"
          />
          <AuthFieldError id="password-error" message={form.formState.errors.password?.message} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirm new password</Label>
          <Input
            id="confirm-password"
            {...form.register('confirmPassword')}
            type="password"
            autoComplete="new-password"
            placeholder="Enter your password again"
            aria-invalid={!!form.formState.errors.confirmPassword}
            aria-describedby="confirm-password-error"
          />
          <AuthFieldError id="confirm-password-error" message={form.formState.errors.confirmPassword?.message} />
        </div>
        <AuthFormMessage>{notice}</AuthFormMessage>
        <Button type="submit" className="h-11 w-full justify-between px-4">
          <span>Update password</span>
          <ArrowRight className="size-4" aria-hidden="true" />
        </Button>
      </form>
    </AuthLayout>
  );
}
