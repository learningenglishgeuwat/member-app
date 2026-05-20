const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/tests/e2e/',
    '<rootDir>/tongue-twister-prototipe/',
    '<rootDir>/linking-word-prototype/',
  ],
  modulePathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/.next_build/',
    '<rootDir>/.next_dev/',
    '<rootDir>/.x/',
    '<rootDir>/.d/',
    '<rootDir>/tongue-twister-prototipe/',
    '<rootDir>/linking-word-prototype/',
  ],
  watchPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/.next_build/',
    '<rootDir>/.next_dev/',
    '<rootDir>/.x/',
    '<rootDir>/.d/',
    '<rootDir>/tongue-twister-prototipe/',
    '<rootDir>/linking-word-prototype/',
  ],
}

module.exports = createJestConfig(customJestConfig)
