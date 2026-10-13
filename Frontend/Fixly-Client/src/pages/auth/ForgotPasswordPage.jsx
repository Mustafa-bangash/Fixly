import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { forgotPasswordSchema } from '../../schemas/authSchemas.js';
import { ROUTES } from '../../utils/routes.js';
import AuthLayout from '../../layouts/AuthLayout.jsx';

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data) => {
    // Note: Backend password reset endpoint is in progress
    // We simulate/handle the response gracefully
    setSubmittedEmail(data.email);
    setIsSubmitted(true);
  };

  return (
    <AuthLayout>
      <div className="mb-6">
        <h1 className="text-[26px] font-bold text-navy leading-tight">
          Reset your password
        </h1>
        <p className="mt-1.5 text-sm text-muted">
          Enter your email address and we will send you instructions to reset your password.
        </p>
      </div>

      {isSubmitted ? (
        <div className="space-y-4">
          <div
            role="status"
            className="rounded-xl border border-brand/20 bg-brand-light p-4 text-sm text-navy font-medium leading-relaxed"
          >
            If an account exists for <b>{submittedEmail}</b>, we have sent a password reset link to your inbox.
          </div>
          <p className="text-xs text-muted">
            Didn&apos;t receive an email? Check your spam folder or try again in a few minutes.
          </p>
          <div className="pt-2">
            <Link
              to={ROUTES.login}
              className="inline-flex w-full items-center justify-center rounded-lg bg-brand py-3 text-base font-semibold text-white transition-colors hover:bg-[#1648a0]"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-navy"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              {...register('email')}
              className={`mt-1.5 w-full rounded-lg border px-3.5 py-2.5 text-base text-ink outline-none transition-colors ${
                errors.email
                  ? 'border-danger focus:border-danger'
                  : 'border-line focus:border-brand'
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-danger font-medium">
                {errors.email.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full rounded-lg bg-brand py-3 text-center text-base font-semibold text-white transition-colors hover:bg-[#1648a0] disabled:opacity-60 cursor-pointer"
          >
            {isSubmitting ? 'Sending link...' : 'Send reset link'}
          </button>

          <div className="pt-3 text-center">
            <Link
              to={ROUTES.login}
              className="text-sm font-semibold text-brand hover:underline"
            >
              ← Back to Sign In
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
}
