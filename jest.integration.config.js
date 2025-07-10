module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.integration.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.test.ts',
    '!src/**/*.integration.test.ts'
  ],
  testTimeout: 30000, // 30 second timeout for integration tests
  setupFilesAfterEnv: ['<rootDir>/jest.integration.setup.js'],
  verbose: true
};
