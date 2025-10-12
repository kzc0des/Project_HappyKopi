import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaristaDashboard } from './barista-dashboard';

describe('BaristaDashboard', () => {
  let component: BaristaDashboard;
  let fixture: ComponentFixture<BaristaDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaristaDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaristaDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
