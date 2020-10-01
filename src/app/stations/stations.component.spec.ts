import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Station } from '../station';

import { StationsComponent } from './stations.component';

describe('StationsComponent', () => {
  let component: StationsComponent;
  let fixture: ComponentFixture<StationsComponent>;
  const stations: Station[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
