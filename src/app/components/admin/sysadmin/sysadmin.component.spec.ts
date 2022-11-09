import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SysadminComponent } from './sysadmin.component';
import { HttpClientModule } from '@angular/common/http';

describe('SysadminComponent', () => {
  let component: SysadminComponent;
  let fixture: ComponentFixture<SysadminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SysadminComponent ],
      imports:[HttpClientModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SysadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
