import { TestBed } from '@angular/core/testing';
import { ErrorInterceptor } from './error.interceptor';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('ErrorInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [],
    providers: [ErrorInterceptor, provideHttpClient(withInterceptorsFromDi())]
}));

  it('should be created', () => {
    const interceptor: ErrorInterceptor = TestBed.inject(ErrorInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
