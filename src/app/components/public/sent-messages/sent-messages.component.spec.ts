import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SentMessagesComponent } from './sent-messages.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('SentMessagesComponent', () => {
  let component: SentMessagesComponent;
  let fixture: ComponentFixture<SentMessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [SentMessagesComponent],
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi())]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SentMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
