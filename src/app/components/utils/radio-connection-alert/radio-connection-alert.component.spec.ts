import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { RadioConnectionAlertComponent } from './radio-connection-alert.component';

describe('RadioConnectionAlertComponent', () => {
  let component: RadioConnectionAlertComponent;
  let fixture: ComponentFixture<RadioConnectionAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RadioConnectionAlertComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RadioConnectionAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});