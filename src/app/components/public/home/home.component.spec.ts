import { ComponentFixture, TestBed } from '@angular/core/testing';

import { homeComponent } from './home.component';

describe('homeComponent', () => {
  let component: homeComponent;
  let fixture: ComponentFixture<homeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ homeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(homeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
