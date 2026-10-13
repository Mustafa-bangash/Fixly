import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signInSchema } from '../../schemas/authSchemas.js';
import { setUser, setPendingEmail } from '../../store/authSlice.js';
import api from '../../api/axiosInstance.js';
import { ROUTES } from '../../utils/routes.js';
import AuthLayout from '../../layouts/AuthLayout.jsx';

export default function SignInPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [serverError, setServerError] = useState('');
  const [unverifiedEmail, setUnverifiedEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Success message if user just verified their email
  const successMessage = location.state?.message || '';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      setServerError('');
      setUnverifiedEmail('');

      const response = await api.post('/auth/customer/login', {
        identifier: data.identifier.trim(),
        password: data.password,
      });

      // Save user to Redux state
      dispatch(setUser(response.data.user));

      // Navigate to homepage or dashboard
      navigate(ROUTES.home);
    } catch (err) {
      const status = err.response?.status;
      const message =
        err.response?.data?.message || 'Invalid email or password. Please try again.';

      if (status === 403) {
        // Account not verified yet
        setUnverifiedEmail(data.identifier);
      }
      setServerError(message);
    }
  };

  const handleGoToVerification = () => {
    dispatch(setPendingEmail(unverifiedEmail));
    navigate(ROUTES.verifyEmail, { state: { email: unverifiedEmail } });
  };

  return (
    <AuthLayout>
      <div className="mb-6">
        <h1 className="text-[26px] font-bold text-navy leading-tight">
          Welcome back
        </h1>
        <p className="mt-1.5 text-sm text-muted">
          Sign in to your Fixly customer account to request repairs and track bids.
        </p>
      </div>

      {successMessage && (
        <div
          role="status"
          className="mb-4 rounded-lg border border-green-300 bg-green-50 p-3 text-sm text-green-800 font-medium"
        >
          {successMessage}
        </div>
      )}

      {serverError && (
        <div
          role="alert"
          className="mb-4 rounded-lg border border-danger/30 bg-red-50 p-3 text-sm text-danger font-medium"
        >
          {serverError}
          {unverifiedEmail && (
            <div className="mt-2">
              <button
                type="button"
                onClick={handleGoToVerification}
                className="text-xs font-bold underline cursor-pointer text-brand hover:text-navy"
              >
                Click here to verify your email code →
              </button>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email or Phone */}
        <div>
          <label
            htmlFor="identifier"
            className="block text-sm font-semibold text-navy"
          >
            Email or mobile number
          </label>
          <input
            id="identifier"
            type="text"
            autoComplete="username"
            placeholder="e.g. ahmed@example.com or 03001234567"
            {...register('identifier')}
            className={`mt-1.5 w-full rounded-lg border px-3.5 py-2.5 text-base text-ink outline-none transition-colors ${
              errors.identifier
                ? 'border-danger focus:border-danger'
                : 'border-line focus:border-brand'
            }`}
          />
          {errors.identifier && (
            <p className="mt-1 text-xs text-danger font-medium">
              {errors.identifier.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-navy"
            >
              Password
            </label>
            <Link
              to={ROUTES.forgotPassword}
              className="text-xs font-semibold text-brand hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative mt-1.5">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Your password"
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

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full rounded-lg bg-brand py-3 text-center text-base font-semibold text-white transition-colors hover:bg-[#1648a0] disabled:opacity-60 cursor-pointer"
        >
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      {/* Footer Navigation */}
      <div className="mt-6 border-t border-line pt-4 text-center text-sm text-muted">
        <p>
          Don&apos;t have an account?{' '}
          <Link to={ROUTES.signup} className="font-semibold text-brand hover:underline">
            Join as a Customer
          </Link>
        </p>
        <p className="mt-2">
          Are you a technician?{' '}
          <Link
            to={ROUTES.providerSignup}
            className="font-semibold text-brand hover:underline"
          >
            Join as a Provider
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
