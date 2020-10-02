import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagecomposeComponent } from './messagecompose.component';

describe('MessagecomposeComponent', () => {
  let component: MessagecomposeComponent;
  let fixture: ComponentFixture<MessagecomposeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessagecomposeComponent ]
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
