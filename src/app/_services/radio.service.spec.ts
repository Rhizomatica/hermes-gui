import { TestBed } from '@angular/core/testing';
import { RadioService } from './radio.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('RadioService', () => {
  let service: RadioService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi())]
});
    service = TestBed.inject(RadioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
