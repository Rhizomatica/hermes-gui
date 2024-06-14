import { TestBed } from '@angular/core/testing';
import { SMSMessageService } from './smsmessage.service';
import { HttpClientModule } from '@angular/common/http';

describe('SMSMessageService', () => {
  let service: SMSMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientModule
      ]
    });
    service = TestBed.inject(SMSMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
