// All page addresses in one place. When a router is added, only this file needs to match it.
export const ROUTES = {
  home: '/',
  login: '/login',
  signup: '/signup',
  how: '/how-it-works',
  info: (slug) => `/info/${slug}`,
};
