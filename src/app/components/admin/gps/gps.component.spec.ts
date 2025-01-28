import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GPSComponent } from './gps.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

describe('GPSComponent', () => {
  let component: GPSComponent;
  let fixture: ComponentFixture<GPSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GPSComponent],
      imports: [HttpClientModule, FormsModule]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GPSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
