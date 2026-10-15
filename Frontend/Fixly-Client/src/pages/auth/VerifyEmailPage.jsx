import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { otpSchema } from '../../schemas/authSchemas.js';
import {
  selectPendingEmail,
  selectPendingRole,
  setPendingAuth,
} from '../../store/authSlice.js';
import { verifyUserEmail, resendUserOtp } from '../../api/authApi.js';
import { ROUTES } from '../../utils/routes.js';
import AuthLayout from '../../layouts/AuthLayout.jsx';

export default function VerifyEmailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const reduxPendingEmail = useSelector(selectPendingEmail);
  const reduxPendingRole = useSelector(selectPendingRole);

  // Extract email and role from location state, Redux store, or query parameters
  const queryParams = new URLSearchParams(location.search);
  const roleFromQuery = queryParams.get('role');

  const activeRole =
    location.state?.role || roleFromQuery || reduxPendingRole || 'customer';
  const isProvider = activeRole === 'provider';

  const emailFromState = location.state?.email || reduxPendingEmail || '';

  const [email, setEmail] = useState(emailFromState);
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [resendCooldown, setResendCooldown] = useState(60);
  const [isResending, setIsResending] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      email: emailFromState,
      otp: '',
    },
  });

  // Sync email into form
  useEffect(() => {
    if (email) {
      setValue('email', email);
    }
  }, [email, setValue]);

  // Resend cooldown timer countdown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const onSubmit = async (data) => {
    try {
      setServerError('');
      setSuccessMessage('');

      // Call the centralized verify API passing the dynamic role ('customer' or 'provider')
      await verifyUserEmail(activeRole, {
        email: data.email.trim().toLowerCase(),
        otp: data.otp.trim(),
      });

      // Verification successful! Redirect to the relevant login page
      const targetLoginRoute = isProvider ? ROUTES.providerLogin : ROUTES.login;

      navigate(targetLoginRoute, {
        state: {
          verifiedSuccess: true,
          message: 'Your email has been verified successfully. Please sign in.',
        },
      });
    } catch (err) {
      const message =
        err.response?.data?.message ||
        'Verification failed. The code may be incorrect or expired.';
      setServerError(message);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || isResending || !email) return;

    try {
      setIsResending(true);
      setServerError('');
      setSuccessMessage('');

      // Call the centralized resend OTP API passing the dynamic role
      const response = await resendUserOtp(activeRole, email);

      setSuccessMessage(
        response.message || 'A new 6-digit code has been sent to your email.'
      );
      setResendCooldown(60);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        'Failed to resend code. Please wait a moment and try again.';
      setServerError(message);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthLayout>
      <div className="mb-6">
        {isProvider && (
          <span className="inline-block rounded-full bg-brand-light px-3 py-1 text-xs font-bold text-brand uppercase tracking-wider mb-2">
            Provider Verification
          </span>
        )}
        <h1 className="text-[26px] font-bold text-navy leading-tight">
          Check your email
        </h1>
        <p className="mt-2 text-sm text-muted">
          We sent a 6-digit verification code to{' '}
          <b className="text-navy">{email || 'your email'}</b>.
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
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-navy">
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setValue('email', e.target.value);
              dispatch(setPendingAuth({ email: e.target.value, role: activeRole }));
            }}
            placeholder="name@example.com"
            className="mt-1.5 w-full rounded-lg border border-line px-3.5 py-2.5 text-base text-ink outline-none focus:border-brand transition-colors"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-danger font-medium">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* OTP Code */}
        <div>
          <label htmlFor="otp" className="block text-sm font-semibold text-navy">
            6-digit verification code
          </label>
          <input
            id="otp"
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="123456"
            {...register('otp')}
            className={`mt-1.5 w-full rounded-lg border px-3.5 py-3 text-center text-2xl font-bold tracking-[8px] text-navy outline-none transition-colors ${
              errors.otp
                ? 'border-danger focus:border-danger'
                : 'border-line focus:border-brand'
            }`}
          />
          {errors.otp && (
            <p className="mt-1 text-xs text-danger font-medium text-center">
              {errors.otp.message}
            </p>
          )}
          <p className="mt-2 text-xs text-muted text-center">
            The code expires in 5 minutes.
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full rounded-lg bg-brand py-3 text-center text-base font-semibold text-white transition-colors hover:bg-[#1648a0] disabled:opacity-60 cursor-pointer"
        >
          {isSubmitting ? 'Verifying code...' : 'Verify Code'}
        </button>
      </form>

      {/* Resend Code Section */}
      <div className="mt-5 text-center text-sm">
        {resendCooldown > 0 ? (
          <p className="text-muted">
            You can request a new code in{' '}
            <span className="font-semibold text-navy">{resendCooldown}s</span>
          </p>
        ) : (
          <button
            type="button"
            disabled={isResending}
            onClick={handleResendOtp}
            className="font-semibold text-brand hover:underline cursor-pointer disabled:opacity-50"
          >
            {isResending ? 'Sending...' : 'Resend verification code'}
          </button>
        )}
      </div>

      <div className="mt-6 border-t border-line pt-4 text-center text-sm text-muted">
        <Link
          to={isProvider ? ROUTES.providerSignup : ROUTES.signup}
          className="text-brand hover:underline"
        >
          ← Back to {isProvider ? 'Provider Sign Up' : 'Sign Up'}
        </Link>
      </div>
    </AuthLayout>
  );
}
