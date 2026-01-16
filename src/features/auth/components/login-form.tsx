import { useState, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { loginSchema, type LoginFormData } from '@/lib/zod-schemas';
import { useLogin } from '../hooks/use-login';

/**
 * Login Form Component
 * Handles email/password authentication with validation
 */
export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isPending, isError, error, reset } = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleFormSubmit = useCallback(
    (data: LoginFormData) => {
      reset(); // Clear previous errors
      login(data);
    },
    [login, reset]
  );

  const handleTogglePassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const emailInputClassName = useMemo(
    () =>
      cn(
        'h-12 rounded-xl border-slate-200 bg-white/70 pl-10 text-base text-slate-900 shadow-sm transition focus-visible:border-teal-500 focus-visible:ring-2 focus-visible:ring-teal-500/40',
        errors.email &&
          'border-red-400 bg-red-50/70 focus-visible:border-red-400 focus-visible:ring-red-300'
      ),
    [errors.email]
  );

  const passwordInputClassName = useMemo(
    () =>
      cn(
        'h-12 rounded-xl border-slate-200 bg-white/70 pl-10 pr-10 text-base text-slate-900 shadow-sm transition focus-visible:border-teal-500 focus-visible:ring-2 focus-visible:ring-teal-500/40',
        errors.password &&
          'border-red-400 bg-red-50/70 focus-visible:border-red-400 focus-visible:ring-red-300'
      ),
    [errors.password]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
          Welcome back
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          <span className="font-serif">Sign in</span> to your dashboard
        </h1>
        <p className="text-sm text-slate-500">
          Track revenue, expenses, and AI alerts in one place.
        </p>
      </div>

      {/* Server Error Alert */}
      {isError && error && (
        <Alert
          variant="destructive"
          className="border-l-4 border-l-red-500 bg-red-50/80"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-slate-700">
            Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              id="email"
              type="email"
              placeholder="you@company.com"
              className={emailInputClassName}
              disabled={isPending}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
              {...register('email')}
            />
          </div>
          {errors.email && (
            <p id="email-error" className="text-sm text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <Label
            htmlFor="password"
            className="text-sm font-medium text-slate-700"
          >
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              className={passwordInputClassName}
              disabled={isPending}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'password-error' : undefined}
              {...register('password')}
            />
            <button
              type="button"
              onClick={handleTogglePassword}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded text-slate-400 transition hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/60 focus-visible:ring-offset-2"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={0}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p id="password-error" className="text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-slate-500">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="size-4 rounded border-slate-300 text-teal-600 shadow-sm focus:ring-2 focus:ring-teal-500/40"
              disabled={isPending}
            />
            Remember for 30 days
          </label>
          <a
            href="/forgot-password"
            className="font-medium text-slate-700 transition hover:text-slate-900 focus:outline-none focus-visible:underline"
            tabIndex={0}
          >
            Forgot password?
          </a>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="h-12 w-full rounded-xl bg-slate-900 text-base font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-slate-900/40"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign in'
          )}
        </Button>
      </form>

      {/* Sign Up Link */}
      <p className="text-center text-sm text-slate-500">
        Don&apos;t have an account?{' '}
        <a
          href="/register"
          className="font-semibold text-slate-900 transition hover:text-slate-700 focus:outline-none focus-visible:underline"
          tabIndex={0}
        >
          Sign up
        </a>
      </p>
    </div>
  );
};
