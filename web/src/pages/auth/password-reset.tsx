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

import { passwordResetSchema } from '@/lib/auth-schemas';

type PasswordResetValues = z.infer<typeof passwordResetSchema>;

export function PasswordResetPage() {
  const [notice, setNotice] = React.useState('');
  const form = useForm<PasswordResetValues>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: { email: '' },
  });

  return (
    <AuthLayout
      eyebrow="Account recovery"
      title="Reset your password"
      description="Enter the email address on your account and we’ll send a reset link."
      footer={
        <>
          Remembered it?{' '}
          <Link className="text-primary font-medium underline-offset-4 hover:underline" to="/login">
            Back to sign in
          </Link>
          <span className="text-border mx-2" aria-hidden="true">
            |
          </span>
          <Link className="text-primary font-medium underline-offset-4 hover:underline" to="/password-update">
            Have a reset link?
          </Link>
        </>
      }>
      <form
        className="mt-7 space-y-4"
        noValidate
        onSubmit={form.handleSubmit(() =>
          setNotice('Password reset is not connected to the server yet. No email was sent.'),
        )}>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            {...form.register('email')}
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={!!form.formState.errors.email}
            aria-describedby="email-error"
          />
          <AuthFieldError id="email-error" message={form.formState.errors.email?.message} />
        </div>
        <AuthFormMessage>{notice}</AuthFormMessage>
        <Button type="submit" className="h-11 w-full justify-between px-4">
          <span>Send reset link</span>
          <ArrowRight className="size-4" aria-hidden="true" />
        </Button>
      </form>
    </AuthLayout>
  );
}
