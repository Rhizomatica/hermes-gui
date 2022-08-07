import { TestBed } from '@angular/core/testing';
import { RadioService } from './radio.service';
import { HttpClientModule } from '@angular/common/http';

describe('RadioService', () => {
  let service: RadioService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });
    service = TestBed.inject(RadioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
