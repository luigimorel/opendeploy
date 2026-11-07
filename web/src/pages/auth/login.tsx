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

import { loginSchema } from '@/lib/auth-schemas';

type LoginValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const [notice, setNotice] = React.useState('');
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Sign in to Open Deploy"
      description="Choose a provider or use your email and password."
      footer={
        <>
          New to Open Deploy?{' '}
          <Link className="text-primary font-medium underline-offset-4 hover:underline" to="/signup">
            Create an account
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
          setNotice('Email sign-in is not connected to the server yet. Your details were not sent.'),
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
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="password">Password</Label>
            <Link className="text-primary text-xs font-medium underline-offset-4 hover:underline" to="/password-reset">
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            {...form.register('password')}
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            aria-invalid={!!form.formState.errors.password}
            aria-describedby="password-error"
          />
          <AuthFieldError id="password-error" message={form.formState.errors.password?.message} />
        </div>
        <AuthFormMessage>{notice}</AuthFormMessage>
        <Button type="submit" className="h-11 w-full justify-between px-4">
          <span>Sign in</span>
          <ArrowRight className="size-4" aria-hidden="true" />
        </Button>
      </form>
    </AuthLayout>
  );
}
