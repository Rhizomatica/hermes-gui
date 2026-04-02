import { TestBed } from '@angular/core/testing'
import { ApiService } from './api.service'
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'

describe('ApiService', () => {
  let service: ApiService,
    http: HttpClient,
    schedules: any
    beforeEach(() => {
    jest.setTimeout(1000000)

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
    jest.setTimeout(5000)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
});
