import { TestBed } from '@angular/core/testing';
import { CustomErrorsService } from './custom-errors.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';

describe('CustomErrorsService', () => {
  let service: CustomErrorsService,
  http: HttpClient

  beforeEach(() => {
      TestBed.configureTestingModule({
          imports: [
            HttpClientModule
          ],
          providers: [
            CustomErrorsService
          ]
        })
        service = TestBed.inject(CustomErrorsService)
        http = TestBed.inject(HttpClient)
  });

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
});
