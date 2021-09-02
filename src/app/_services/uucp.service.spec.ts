import { TestBed } from '@angular/core/testing';

import { UucpService } from './uucp.service';

describe('UucpService', () => {
  let service: UucpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UucpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
