import { TestBed } from '@angular/core/testing';
import { FrequencyService } from './frequency.service';
import { HttpClientModule } from '@angular/common/http';

describe('FrequencyService', () => {
  let service: FrequencyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientModule
      ]
    });
    service = TestBed.inject(FrequencyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
