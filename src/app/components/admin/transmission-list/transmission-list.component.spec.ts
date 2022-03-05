import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransmissionListComponent } from './transmission-list.component';

describe('TransmissionListComponent', () => {
  let component: TransmissionListComponent;
  let fixture: ComponentFixture<TransmissionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransmissionListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransmissionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
