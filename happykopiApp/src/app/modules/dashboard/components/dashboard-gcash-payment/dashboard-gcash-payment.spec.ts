import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardGcashPayment } from './dashboard-gcash-payment';

describe('DashboardGcashPayment', () => {
  let component: DashboardGcashPayment;
  let fixture: ComponentFixture<DashboardGcashPayment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardGcashPayment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardGcashPayment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
