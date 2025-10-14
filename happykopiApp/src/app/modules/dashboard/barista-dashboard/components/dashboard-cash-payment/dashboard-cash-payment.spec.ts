import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCashPayment } from './dashboard-cash-payment';

describe('DashboardCashPayment', () => {
  let component: DashboardCashPayment;
  let fixture: ComponentFixture<DashboardCashPayment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardCashPayment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardCashPayment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
