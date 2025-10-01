import type { Config } from 'jest';
import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {


  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
      },
    ],
  },
  preset: 'ts-jest',
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': 'jest-css-modules-transform',
    "^@/(.*)$": "<rootDir>/src/$1",
    '^@api$': '<rootDir>/src/utils/burger-api.ts',
    '^@utils-types$': '<rootDir>/src/utils/types.ts',
  }
};

export default config;
