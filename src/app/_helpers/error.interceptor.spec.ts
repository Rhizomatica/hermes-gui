import { TestBed } from '@angular/core/testing';
import { ErrorInterceptor } from './error.interceptor';
import { HttpClientModule } from '@angular/common/http';

describe('ErrorInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [ErrorInterceptor],
    imports: [HttpClientModule]
  }));

  it('should be created', () => {
    const interceptor: ErrorInterceptor = TestBed.inject(ErrorInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
