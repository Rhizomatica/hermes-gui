import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessagesComponent } from './messages.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('MessagesComponent', () => {
  let component: MessagesComponent;
  let fixture: ComponentFixture<MessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [MessagesComponent],
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi())]
})
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
