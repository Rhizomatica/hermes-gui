import { UserExistDirective } from './user-exist.directive';
import '@testing-library/jest-dom';
import { jest } from '@jest/globals';

describe('UserExistDirective', () => {
it('should create an instance', () => {
  const mockUserService = { someMethod: jest.fn() };
  const directive = new UserExistDirective(mockUserService);
  expect(directive).toBeTruthy();
});
});
