import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MessageConfigComponent } from './message-config.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('MessageadmComponent', () => {
  let component: MessageConfigComponent;
  let fixture: ComponentFixture<MessageConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [MessageConfigComponent],
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi())],
    schemas: [NO_ERRORS_SCHEMA]
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
