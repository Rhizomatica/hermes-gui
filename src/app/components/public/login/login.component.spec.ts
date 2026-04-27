import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from "@angular/router/testing";
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [LoginComponent],
    imports: [RouterTestingModule,
        ReactiveFormsModule,
        FormsModule],
    providers: [provideHttpClient(withInterceptorsFromDi())],
    schemas: [NO_ERRORS_SCHEMA]
})
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
