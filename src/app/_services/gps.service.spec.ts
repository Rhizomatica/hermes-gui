import { TestBed } from '@angular/core/testing'
import { GPSService } from './gps.service'
import { HttpClient, HttpErrorResponse, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { GlobalConstants } from '../global-constants'

describe('GPSService', () => {
  let service: GPSService,
    http: HttpClient

  beforeEach(() => {
    jest.setTimeout(1000000)

    TestBed.configureTestingModule({
    imports: [],
    providers: [
        GPSService,
        provideHttpClient(withInterceptorsFromDi())
    ]
})
    service = TestBed.inject(GPSService)
    http = TestBed.inject(HttpClient)
  })

  afterEach(function () {
    jest.setTimeout(5000)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  //APP GENERALS
  it('should test url gps files', () => {
    const spy = jest.spyOn(http, 'get')
    service.getStoredGPSFiles()
    expect(spy).toHaveBeenCalledWith(`${GlobalConstants.apiURL}/geolocation/files`);
  })
});
