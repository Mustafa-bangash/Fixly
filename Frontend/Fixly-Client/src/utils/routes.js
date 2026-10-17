// all page addresses are kept here so they are easy to change when the router is added
export const ROUTES = {
  home: '/',
  login: '/login',
  signup: '/signup',
  providerSignup: '/provider/signup',
  providerLogin: '/provider/login',
  verifyEmail: '/verify-email',
  forgotPassword: '/forgot-password',
  how: '/how-it-works',
  info: (slug) => `/info/${slug}`,
  createRepairRequest: '/repair-requests/new',
};
