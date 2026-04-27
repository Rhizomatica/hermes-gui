import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MessageDetailComponent } from './message-detail.component';
import { Message } from '../../../interfaces/message';
import { RouterTestingModule } from "@angular/router/testing";
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('MessageDetailComponent', () => {
  let component: MessageDetailComponent;
  let fixture: ComponentFixture<MessageDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [MessageDetailComponent],
    imports: [RouterTestingModule],
    providers: [provideHttpClient(withInterceptorsFromDi())],
    schemas: [NO_ERRORS_SCHEMA]
})
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
