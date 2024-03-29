import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RadioConfigComponent } from './radio-config.component';
import { HttpClientModule } from '@angular/common/http';

describe('RadioConfigComponent', () => {
  let component: RadioConfigComponent;
  let fixture: ComponentFixture<RadioConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RadioConfigComponent],
      imports: [HttpClientModule]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RadioConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
