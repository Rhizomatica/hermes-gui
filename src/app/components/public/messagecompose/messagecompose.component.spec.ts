import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessagecomposeComponent } from './messagecompose.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { RouterTestingModule } from "@angular/router/testing";

describe('MessagecomposeComponent', () => {
  let component: MessagecomposeComponent;
  let fixture: ComponentFixture<MessagecomposeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [MessagecomposeComponent],
    imports: [RouterTestingModule],
    providers: [provideHttpClient(withInterceptorsFromDi())]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagecomposeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
