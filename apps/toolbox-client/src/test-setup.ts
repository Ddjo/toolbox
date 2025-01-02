import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

// @ts-expect-error https://thymikee.github.io/jest-preset-angular/docs/getting-started/test-environment
globalThis.ngJest = {
  testEnvironmentOptions: {
    errorOnUnknownElements: true,
    errorOnUnknownProperties: true,
  },
};
// import 'jest-preset-angular/setup-jest';
setupZoneTestEnv();
