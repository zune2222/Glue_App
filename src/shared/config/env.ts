type Environment = 'development' | 'testing' | 'production';

interface EnvConfig {
  API_URL: string;
  API_TIMEOUT: number;
  AUTH_STORAGE_KEY: string;
  ENABLE_LOGGING: boolean;
}

const ENV: Record<Environment, EnvConfig> = {
  development: {
    API_URL: 'https://dev-api.example.com',
    API_TIMEOUT: 30000,
    AUTH_STORAGE_KEY: 'auth_token_dev',
    ENABLE_LOGGING: true,
  },
  testing: {
    API_URL: 'https://test-api.example.com',
    API_TIMEOUT: 20000,
    AUTH_STORAGE_KEY: 'auth_token_test',
    ENABLE_LOGGING: true,
  },
  production: {
    API_URL: 'https://api.example.com',
    API_TIMEOUT: 15000,
    AUTH_STORAGE_KEY: 'auth_token',
    ENABLE_LOGGING: false,
  },
};

// 현재 환경 설정
const getEnvironment = (): Environment => {
  if (__DEV__) return 'development';

  // 추가 환경 감지 로직
  // 앱 번들 ID 또는 기타 설정에 따라 환경 결정 가능
  return 'production';
};

export const config = ENV[getEnvironment()];
