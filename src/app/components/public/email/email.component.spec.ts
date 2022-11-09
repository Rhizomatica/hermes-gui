import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmailComponent } from './email.component';
import { HttpClientModule } from '@angular/common/http';

describe('EmailComponent', () => {
  let component: EmailComponent;
  let fixture: ComponentFixture<EmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailComponent ],
      imports:[HttpClientModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
