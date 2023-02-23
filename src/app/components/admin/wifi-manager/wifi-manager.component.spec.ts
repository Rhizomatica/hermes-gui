import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WifiManagerComponent } from './wifi-manager.component';
import { HttpClientModule } from '@angular/common/http';

describe('CustomErrorsComponent', () => {
  let component: WifiManagerComponent;
  let fixture: ComponentFixture<WifiManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WifiManagerComponent],
      imports: [HttpClientModule]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WifiManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
