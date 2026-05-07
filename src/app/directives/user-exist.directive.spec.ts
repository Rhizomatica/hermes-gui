import { TestBed } from '@angular/core/testing';
import { UserExistDirective } from './user-exist.directive';
import { UserService } from '../_services/user.service';
import { of } from 'rxjs';

describe('UserExistDirective', () => {
  let directive: UserExistDirective;
  let mockUserService: { getUsers: jest.Mock };

  beforeEach(() => {
    mockUserService = {
      getUsers: jest.fn().mockReturnValue(of([]))
    };

    TestBed.configureTestingModule({
      providers: [
        UserExistDirective,
        { provide: UserService, useValue: mockUserService }
      ]
    });

    directive = TestBed.inject(UserExistDirective);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should load users on init', () => {
    directive.ngOnInit();
    expect(mockUserService.getUsers).toHaveBeenCalled();
  });
});
