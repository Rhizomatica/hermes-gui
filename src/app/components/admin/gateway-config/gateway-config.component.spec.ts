import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GatewayConfigComponent } from './gateway-config.component';
import { HttpClientModule } from '@angular/common/http';

describe('GatewayConfigComponent', () => {
  let component: GatewayConfigComponent;
  let fixture: ComponentFixture<GatewayConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GatewayConfigComponent ],
      imports:[HttpClientModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GatewayConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
