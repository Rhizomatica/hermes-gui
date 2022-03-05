import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageadmComponent } from './messageadm.component';

describe('MessageadmComponent', () => {
  let component: MessageadmComponent;
  let fixture: ComponentFixture<MessageadmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageadmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageadmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
