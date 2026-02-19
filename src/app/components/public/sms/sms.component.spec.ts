import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SMSComponent } from './sms.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

describe('SMSComponent', () => {
  let component: SMSComponent;
  let fixture: ComponentFixture<SMSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [SMSComponent],
    imports: [RouterTestingModule,
        ReactiveFormsModule,
        FormsModule],
    providers: [provideHttpClient(withInterceptorsFromDi())]
})
      .compileComponents();
  });

  // beforeEach(() => {
  //   fixture = TestBed.createComponent(SMSComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();
  // });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
