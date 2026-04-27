import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { WiFiManagementComponent } from './wifi-management.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

describe('WiFiManagementComponent', () => {
  let component: WiFiManagementComponent;
  let fixture: ComponentFixture<WiFiManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [WiFiManagementComponent],
    imports: [RouterTestingModule,
        ReactiveFormsModule,
        FormsModule],
    providers: [provideHttpClient(withInterceptorsFromDi())],
    schemas: [NO_ERRORS_SCHEMA]
})
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WiFiManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
