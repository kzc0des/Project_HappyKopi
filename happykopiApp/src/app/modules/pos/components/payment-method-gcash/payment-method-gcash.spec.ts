import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentMethodGcash } from './payment-method-gcash';

describe('PaymentMethodGcash', () => {
  let component: PaymentMethodGcash;
  let fixture: ComponentFixture<PaymentMethodGcash>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentMethodGcash]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentMethodGcash);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
