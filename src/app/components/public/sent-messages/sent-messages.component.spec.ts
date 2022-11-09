import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SentMessagesComponent } from './sent-messages.component';
import { HttpClientModule } from '@angular/common/http';

describe('SentMessagesComponent', () => {
  let component: SentMessagesComponent;
  let fixture: ComponentFixture<SentMessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SentMessagesComponent ],
      imports: [HttpClientModule]
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
