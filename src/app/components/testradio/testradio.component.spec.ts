import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestradioComponent } from './testradio.component';

describe('TestradioComponent', () => {
  let component: TestradioComponent;
  let fixture: ComponentFixture<TestradioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestradioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestradioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
