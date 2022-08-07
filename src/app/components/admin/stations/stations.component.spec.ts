import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Station } from '../../../interfaces/station';
import { StationsComponent } from './stations.component';
import { HttpClientModule } from '@angular/common/http';

describe('StationsComponent', () => {
  let component: StationsComponent;
  let fixture: ComponentFixture<StationsComponent>;
  // const station: Station[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StationsComponent],
      imports: [HttpClientModule]
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
