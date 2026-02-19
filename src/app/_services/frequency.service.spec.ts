import { TestBed } from '@angular/core/testing';
import { FrequencyService } from './frequency.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('FrequencyService', () => {
  let service: FrequencyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi())]
});
    service = TestBed.inject(FrequencyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
