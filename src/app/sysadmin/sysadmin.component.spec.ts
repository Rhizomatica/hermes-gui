import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SysadminComponent } from './sysadmin.component';

describe('SysadminComponent', () => {
  let component: SysadminComponent;
  let fixture: ComponentFixture<SysadminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SysadminComponent ]
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
