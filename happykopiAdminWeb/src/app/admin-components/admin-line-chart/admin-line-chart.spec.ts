import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLineChart } from './admin-line-chart';

describe('AdminLineChart', () => {
  let component: AdminLineChart;
  let fixture: ComponentFixture<AdminLineChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminLineChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminLineChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
