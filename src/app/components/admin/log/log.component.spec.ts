import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogComponent } from './log.component';
import { HttpClientModule } from '@angular/common/http';

describe('LogComponent', () => {
  let component: LogComponent;
  let fixture: ComponentFixture<LogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LogComponent],
      imports: [HttpClientModule]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
