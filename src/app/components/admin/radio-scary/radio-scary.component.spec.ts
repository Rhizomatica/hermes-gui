import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadioScaryComponent } from './radio-scary.component';

describe('RadioConfigComponent', () => {
  let component: RadioScaryComponent;
  let fixture: ComponentFixture<RadioScaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RadioScaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RadioScaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
