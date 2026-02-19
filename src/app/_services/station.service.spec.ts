import { TestBed } from '@angular/core/testing';
import { StationService } from './station.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('StationService', () => {
  let service: StationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi())]
});
    service = TestBed.inject(StationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
