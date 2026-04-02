import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransmissionListComponent } from './transmission-list.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('TransmissionListComponent', () => {
  let component: TransmissionListComponent;
  let fixture: ComponentFixture<TransmissionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [TransmissionListComponent],
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi())]
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
