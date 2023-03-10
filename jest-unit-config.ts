import { configDefault } from './jest.config'

const config = {
  ...configDefault,
  testMatch: ['**/*.spec.ts'],
};

export default config;
