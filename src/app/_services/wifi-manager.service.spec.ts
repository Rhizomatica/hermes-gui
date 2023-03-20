import { TestBed } from '@angular/core/testing';
import { WifiManagerService } from './wifi-manager.service';
import { HttpClientModule } from '@angular/common/http';

describe('WifiManager', () => {
  let service: WifiManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientModule
      ]
    });
    service = TestBed.inject(WifiManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
