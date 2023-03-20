import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomErrorsComponent } from './custom-errors.component';
import { HttpClientModule } from '@angular/common/http';

describe('CustomErrorsComponent', () => {
  let component: CustomErrorsComponent;
  let fixture: ComponentFixture<CustomErrorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomErrorsComponent],
      imports: [HttpClientModule]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomErrorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
