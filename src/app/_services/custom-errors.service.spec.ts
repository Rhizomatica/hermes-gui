import { TestBed } from '@angular/core/testing';
import { CustomErrorsService } from './custom-errors.service';
import { HttpClientModule } from '@angular/common/http';

describe('CustomErrorsService', () => {
  let service: CustomErrorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientModule
      ]
    });
    service = TestBed.inject(CustomErrorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
