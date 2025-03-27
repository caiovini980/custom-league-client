const config = {
  authRoute: '/login',
  baseUrl: `${import.meta.env.API_BASE_URL}/api`,
  env: import.meta.env.NODE_ENV,
  defaultRoute: '/home',
  headerTabHeight: 50,
  cityInfoWidth: 280,
  verticalBarWidth: 60,
} as const;

export default config;
