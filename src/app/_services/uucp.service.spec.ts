import { TestBed } from '@angular/core/testing';
import { UUCPService } from './uucp.service';
import { HttpClientModule } from '@angular/common/http';

describe('UUCPService', () => {
  let service: UUCPService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });
    service = TestBed.inject(UUCPService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
