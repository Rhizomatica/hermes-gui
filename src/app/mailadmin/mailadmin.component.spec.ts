import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailadminComponent } from './mailadmin.component';

describe('MailadminComponent', () => {
  let component: MailadminComponent;
  let fixture: ComponentFixture<MailadminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MailadminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MailadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
