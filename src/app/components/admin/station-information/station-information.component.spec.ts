import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StationInformationComponent } from './station-information.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('StationInformationComponent', () => {
  let component: StationInformationComponent;
  let fixture: ComponentFixture<StationInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [StationInformationComponent],
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi())]
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
