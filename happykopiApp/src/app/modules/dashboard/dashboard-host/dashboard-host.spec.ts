import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardHost } from './dashboard-host';

describe('DashboardHost', () => {
  let component: DashboardHost;
  let fixture: ComponentFixture<DashboardHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardHost]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardHost);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
