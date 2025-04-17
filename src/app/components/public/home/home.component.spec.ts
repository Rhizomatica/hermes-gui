import { ComponentFixture, TestBed } from '@angular/core/testing';
import { homeComponent } from './home.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';

describe('homeComponent', () => {
  let component: homeComponent;
  let fixture: ComponentFixture<homeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HttpClientModule, HttpClient, homeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(homeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
