import { TestBed } from '@angular/core/testing'
import { GPSService } from './gps.service'
import { HttpClientModule, HttpClient, HttpErrorResponse } from '@angular/common/http'
import { GlobalConstants } from '../global-constants';

describe('GPSService', () => {
  let service: GPSService,
    http: HttpClient,
    originalTimeout

  beforeEach(() => {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000

    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ],
      providers: [
        GPSService
      ]
    })
    service = TestBed.inject(GPSService)
    http = TestBed.inject(HttpClient)
  })

  afterEach(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  //APP GENERALS
  it('should test url server status', () => {
    const spy = spyOn(http, 'get').and.callThrough()
    service.getStoredGPSFiles()
    expect(spy).toHaveBeenCalledWith(`${GlobalConstants.apiURL}/sys/status`);
  })
});
