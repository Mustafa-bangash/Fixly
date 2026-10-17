// Centralized route paths for Fixly
export const ROUTES = {
  home: '/',
  dashboard: '/dashboard',
  requests: '/requests',
  messages: '/messages',
  history: '/history',
  emergency: '/emergency',
  profile: '/profile',
  login: '/login',
  signup: '/signup',
  providerSignup: '/provider/signup',
  providerLogin: '/provider/login',
  verifyEmail: '/verify-email',
  forgotPassword: '/forgot-password',
  how: '/how-it-works',
  terms: '/terms',
  privacy: '/privacy',
  info: (slug) => `/info/${slug}`,
  createRepairRequest: '/repair-requests/new',
};

