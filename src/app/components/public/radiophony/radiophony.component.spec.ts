import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RadiophonyComponent } from './radiophony.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

describe('CustomErrorsComponent', () => {
  let component: RadiophonyComponent;
  let fixture: ComponentFixture<RadiophonyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RadiophonyComponent],
      imports: [
        RouterTestingModule,
        HttpClientModule,
        ReactiveFormsModule,
        FormsModule]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RadiophonyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
