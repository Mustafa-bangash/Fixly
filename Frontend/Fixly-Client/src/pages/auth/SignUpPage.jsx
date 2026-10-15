import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signUpSchema } from '../../schemas/authSchemas.js';
import { setPendingAuth } from '../../store/authSlice.js';
import { registerUser } from '../../api/authApi.js';
import { ROUTES } from '../../utils/routes.js';
import AuthLayout from '../../layouts/AuthLayout.jsx';

export default function SignUpPage({ role = 'customer' }) {
  const isProvider = role === 'provider';
  const activeRole = isProvider ? 'provider' : 'customer';

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
    },
  });

  const onSubmit = async (data) => {
    try {
      setServerError('');

      // Call the centralized registration API with dynamic role
      await registerUser(activeRole, {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });

      // Save pending email and role in Redux
      dispatch(setPendingAuth({ email: data.email, role: activeRole }));

      // Navigate to email verification screen passing email and role in state
      navigate(ROUTES.verifyEmail, { state: { email: data.email, role: activeRole } });
    } catch (err) {
      const message =
        err.response?.data?.message ||
        'Failed to create account. Please check your details and try again.';
      setServerError(message);
    }
  };

  return (
    <AuthLayout>
      <div className="mb-6">
        <h1 className="text-[26px] font-bold text-navy leading-tight">
          {isProvider ? 'Join as a Provider' : 'Create your account'}
        </h1>
        <p className="mt-1.5 text-sm text-muted">
          {isProvider
            ? 'Create your provider account. You will complete identity and skill verification after you log in.'
            : 'We will verify your email address with a 6-digit code when you sign up.'}
        </p>
      </div>

      {serverError && (
        <div
          role="alert"
          className="mb-4 rounded-lg border border-danger/30 bg-red-50 p-3 text-sm text-danger font-medium"
        >
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Full Name */}
        <div>
          <label
            htmlFor="fullName"
            className="block text-sm font-semibold text-navy"
          >
            Full name
          </label>
          <input
            id="fullName"
            type="text"
            autoComplete="name"
            placeholder={isProvider ? 'e.g. Usman Tariq' : 'e.g. Ahmed Khan'}
            {...register('fullName')}
            className={`mt-1.5 w-full rounded-lg border px-3.5 py-2.5 text-base text-ink outline-none transition-colors ${
              errors.fullName
                ? 'border-danger focus:border-danger'
                : 'border-line focus:border-brand'
            }`}
          />
          {errors.fullName && (
            <p className="mt-1 text-xs text-danger font-medium">
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* Email */}
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

        {/* Mobile Number */}
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-semibold text-navy"
          >
            Mobile number
          </label>
          <input
            id="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="03XX XXXXXXX"
            {...register('phone')}
            className={`mt-1.5 w-full rounded-lg border px-3.5 py-2.5 text-base text-ink outline-none transition-colors ${
              errors.phone
                ? 'border-danger focus:border-danger'
                : 'border-line focus:border-brand'
            }`}
          />
          {errors.phone && (
            <p className="mt-1 text-xs text-danger font-medium">
              {errors.phone.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-semibold text-navy"
          >
            Password
          </label>
          <div className="relative mt-1.5">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="At least 8 characters"
              {...register('password')}
              className={`w-full rounded-lg border px-3.5 py-2.5 pr-14 text-base text-ink outline-none transition-colors ${
                errors.password
                  ? 'border-danger focus:border-danger'
                  : 'border-line focus:border-brand'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-brand hover:underline"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-danger font-medium">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-semibold text-navy"
          >
            Confirm password
          </label>
          <div className="relative mt-1.5">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Re-type password"
              {...register('confirmPassword')}
              className={`w-full rounded-lg border px-3.5 py-2.5 pr-14 text-base text-ink outline-none transition-colors ${
                errors.confirmPassword
                  ? 'border-danger focus:border-danger'
                  : 'border-line focus:border-brand'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-brand hover:underline"
            >
              {showConfirmPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-danger font-medium">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Agree to Terms */}
        <div className="pt-1">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              {...register('agreeToTerms')}
              className="mt-1 h-4 w-4 rounded border-line text-brand focus:ring-brand"
            />
            <span className="text-xs text-muted leading-snug">
              I agree to the{' '}
              <Link to={ROUTES.terms} className="text-brand underline">
                Terms &amp; Conditions
              </Link>{' '}
              and{' '}
              <Link to={ROUTES.privacy} className="text-brand underline">
                Privacy Policy
              </Link>
            </span>
          </label>
          {errors.agreeToTerms && (
            <p className="mt-1 text-xs text-danger font-medium">
              {errors.agreeToTerms.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full rounded-lg bg-brand py-3 text-center text-base font-semibold text-white transition-colors hover:bg-[#1648a0] disabled:opacity-60 cursor-pointer"
        >
          {isSubmitting
            ? 'Creating account...'
            : isProvider
            ? 'Create Provider Account'
            : 'Create Account'}
        </button>
      </form>

      {/* Footer Navigation Links */}
      <div className="mt-6 border-t border-line pt-4 text-center text-sm text-muted">
        <p>
          {isProvider ? 'Already have a provider account?' : 'Already have an account?'}{' '}
          <Link
            to={isProvider ? ROUTES.providerLogin : ROUTES.login}
            className="font-semibold text-brand hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
