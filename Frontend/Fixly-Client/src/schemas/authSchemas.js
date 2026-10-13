import { z } from 'zod';

// Pakistani mobile phone regex: 03XXXXXXXXX (11 digits) or +923XXXXXXXXX
const phoneRegex = /^((\+92)|(0092)|(0))?3[0-9]{9}$/;

// Customer Signup Schema
export const signUpSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, 'Please enter your full name (at least 2 characters)'),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email('Please enter a valid email address'),
    phone: z
      .string()
      .trim()
      .regex(phoneRegex, 'Please enter a valid Pakistani mobile number (e.g. 03001234567)'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long'),
    confirmPassword: z
      .string()
      .min(1, 'Please confirm your password'),
    agreeToTerms: z
      .boolean()
      .refine((val) => val === true, 'You must agree to the Terms & Conditions to continue'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'The two passwords do not match',
    path: ['confirmPassword'],
  });

// Customer Sign In Schema
export const signInSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, 'Please enter your email or mobile number'),
  password: z
    .string()
    .min(1, 'Please enter your password'),
});

// Verify Email / OTP Schema
export const otpSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Valid email is required'),
  otp: z
    .string()
    .trim()
    .length(6, 'Please enter the 6-digit verification code')
    .regex(/^\d{6}$/, 'Code must contain only numbers'),
});

// Forgot Password Schema
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Please enter a valid email address'),
});
