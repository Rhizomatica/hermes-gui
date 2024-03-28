import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageConfigComponent } from './message-config.component';
import { HttpClientModule } from '@angular/common/http';

describe('MessageadmComponent', () => {
  let component: MessageConfigComponent;
  let fixture: ComponentFixture<MessageConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MessageConfigComponent],
      imports: [HttpClientModule]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
