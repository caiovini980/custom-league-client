const env = import.meta.env.VITE_NODE_ENV ?? 'production';

const config = {
  env,
  isDev: env === 'development',
  topBarHeight: 50,
} as const;

export default config;
