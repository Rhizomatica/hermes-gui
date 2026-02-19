import { TestBed } from '@angular/core/testing'
import { ApiService } from './api.service'
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'

describe('ApiService', () => {
  let service: ApiService,
    http: HttpClient,
    originalTimeout,
    schedules: any
    beforeEach(() => {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000

    TestBed.configureTestingModule({
    imports: [],
    providers: [
        ApiService,
        provideHttpClient(withInterceptorsFromDi())
    ]
})
    service = TestBed.inject(ApiService)
    http = TestBed.inject(HttpClient)
  })

  afterEach(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
});
