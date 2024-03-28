import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StationInformationComponent } from './station-information.component';
import { HttpClientModule } from '@angular/common/http';

describe('NetadminComponent', () => {
  let component: StationInformationComponent;
  let fixture: ComponentFixture<StationInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StationInformationComponent],
      imports: [HttpClientModule]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StationInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
