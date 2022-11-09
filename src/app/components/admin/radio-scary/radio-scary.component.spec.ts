import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RadioScaryComponent } from './radio-scary.component';
import { HttpClientModule } from '@angular/common/http';

describe('RadioScaryComponent', () => {
  let component: RadioScaryComponent;
  let fixture: ComponentFixture<RadioScaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RadioScaryComponent],
      imports: [HttpClientModule]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RadioScaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
