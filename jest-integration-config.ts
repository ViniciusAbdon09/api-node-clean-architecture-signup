import { configDefault } from './jest.config'

const config = {
  ...configDefault,
  testMatch: ['**/*.test.ts'],
};

export default config;
