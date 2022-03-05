import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HmheaderComponent } from './hmheader.component';

describe('HmheaderComponent', () => {
  let component: HmheaderComponent;
  let fixture: ComponentFixture<HmheaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HmheaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HmheaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
