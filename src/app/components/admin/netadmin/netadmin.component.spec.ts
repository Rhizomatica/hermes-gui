import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NetadminComponent } from './netadmin.component';
import { HttpClientModule } from '@angular/common/http';

describe('NetadminComponent', () => {
  let component: NetadminComponent;
  let fixture: ComponentFixture<NetadminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NetadminComponent],
      imports: [HttpClientModule]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NetadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
