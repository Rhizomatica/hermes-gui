import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { WifiManagerService } from './wifi-manager.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

describe('WifiManager', () => {
  let service: WifiManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [RouterTestingModule,
        ReactiveFormsModule,
        FormsModule],
    providers: [provideHttpClient(withInterceptorsFromDi())]
});
    service = TestBed.inject(WifiManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
