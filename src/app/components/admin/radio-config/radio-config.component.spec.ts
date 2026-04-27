import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RadioConfigComponent } from './radio-config.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('RadioConfigComponent', () => {
  let component: RadioConfigComponent;
  let fixture: ComponentFixture<RadioConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [RadioConfigComponent],
    imports: [ReactiveFormsModule, FormsModule],
    providers: [provideHttpClient(withInterceptorsFromDi())],
    schemas: [NO_ERRORS_SCHEMA]
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
