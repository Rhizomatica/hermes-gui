import { UserExistDirective } from './user-exist.directive';

describe('UserExistDirective', () => {
  it('should create an instance', () => {
    const mockUserService = jasmine.createSpyObj('UserService', ['someMethod']);
    const directive = new UserExistDirective(mockUserService);
    expect(directive).toBeTruthy();
  });
});
