import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransmisionListComponent } from './transmision-list.component';
import { HttpClientModule } from '@angular/common/http';

describe('TransmissionListComponent', () => {
  let component: TransmisionListComponent;
  let fixture: ComponentFixture<TransmisionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransmisionListComponent ],
      imports:[HttpClientModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransmisionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
