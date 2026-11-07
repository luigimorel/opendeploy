import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import * as React from 'react';

import { AuthFieldError, AuthFormMessage, AuthLayout, ProviderButtons } from '@/components/auth-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { signUpSchema } from '@/lib/auth-schemas';

type SignUpValues = z.infer<typeof signUpSchema>;

export function SignUpPage() {
  const [notice, setNotice] = React.useState<React.ReactNode>(null);
  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  return (
    <AuthLayout
      eyebrow="Create an account"
      title="Start deploying"
      description="Create an account with a provider or your email address."
      footer={
        <>
          Already have an account?{' '}
          <Link className="text-primary font-medium underline-offset-4 hover:underline" to="/login">
            Sign in
          </Link>
        </>
      }>
      <ProviderButtons
        onProvider={(provider) => setNotice(`${provider} authentication is not connected to the server yet.`)}
      />
      <form
        className="space-y-4"
        noValidate
        onSubmit={form.handleSubmit(() =>
          setNotice('Email signup is not connected to the server yet. Your details were not sent.'),
        )}>
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            {...form.register('username')}
            autoComplete="username"
            placeholder="your-name"
            aria-invalid={!!form.formState.errors.username}
            aria-describedby="username-error"
          />
          <AuthFieldError id="username-error" message={form.formState.errors.username?.message} />
        </div>
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
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
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
          <Label htmlFor="confirm-password">Confirm password</Label>
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
          <span>Create account</span>
          <ArrowRight className="size-4" aria-hidden="true" />
        </Button>
      </form>
    </AuthLayout>
  );
}
