import { TestBed } from '@angular/core/testing';
import { CustomErrorsService } from './custom-errors.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { GlobalConstants } from '../global-constants';
import { CustomError } from '../interfaces/customerror';

describe('CustomErrorsService', () => {
  let service: CustomErrorsService;
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientTestingModule
      ],
      providers: [
        CustomErrorsService
      ]
    });
    service = TestBed.inject(CustomErrorsService);
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch custom errors', () => {
    let now = (new Date()).toString()

    const mockErrors: CustomError[] = [
      { error_code: 1, error_message: 'Error 1', controller: 'ErrorController',  stacktrace: null, updated_at: now, created_at: now },
      { error_code: 2, error_message: 'Error 2', controller: 'ErrorController',  stacktrace: null, updated_at: now, created_at: now}
    ];

    service.getCustomErrors().subscribe(errors => {
      expect(errors).toEqual(mockErrors);
    });

    const req = httpMock.expectOne(`${GlobalConstants.apiURL}/customerrors`);
    expect(req.request.method).toBe('GET');
    req.flush(mockErrors);
  });

  it('should delete a custom error by id', () => {
    const id = 1;

    service.deleteCustomError(id).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${GlobalConstants.apiURL}/customerrors/${id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should delete all custom errors', () => {
    service.deleteAllCustomError().subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${GlobalConstants.apiURL}/customerrors`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should create a new custom error', () => {
    let now = (new Date()).toString()
    const newError: CustomError = { error_code: 3, error_message: 'New Error', controller: 'ErrorController',  stacktrace: null, updated_at: now, created_at: now };

    service.newCustomError(newError).subscribe(error => {
      expect(error).toEqual(newError);
    });

    const req = httpMock.expectOne(`${GlobalConstants.apiURL}/customerrors`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newError);
    req.flush(newError);
  });
});
