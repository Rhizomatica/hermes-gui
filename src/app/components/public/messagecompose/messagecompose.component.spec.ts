import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessagecomposeComponent } from './messagecompose.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from "@angular/router/testing";

describe('MessagecomposeComponent', () => {
  let component: MessagecomposeComponent;
  let fixture: ComponentFixture<MessagecomposeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessagecomposeComponent ],
      imports: [
        RouterTestingModule,
        HttpClientModule
      ]    
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
