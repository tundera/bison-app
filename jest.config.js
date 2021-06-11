/**
 * @type {import('@jest/types').Config.InitialOptionsWithRootDir}
 */
module.exports = {
  preset: 'ts-jest',
  rootDir: 'tests',
  testEnvironment: 'jsdom',
  // setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.ts'],
  globalSetup: '<rootDir>/jest.setup.js',
  globalTeardown: '<rootDir>/jest.teardown.js',
  testPathIgnorePatterns: [
    '<rootDir>/node_modules',
    'cypress',
    'factories',
    'helpers',
    'tests/e2e',
  ],
  globals: {
    'ts-jest': {
      tsconfig: {
        jsx: 'react-jsx',
      },
    },
  },
};
