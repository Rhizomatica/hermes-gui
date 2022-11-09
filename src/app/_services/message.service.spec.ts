import { TestBed } from '@angular/core/testing';
import { MessageService } from './message.service';
import { HttpClientModule } from '@angular/common/http';

describe('MessageService', () => {
  let service: MessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientModule
      ]
    });
    service = TestBed.inject(MessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
