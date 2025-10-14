import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentMethodCash } from './payment-method-cash';

describe('PaymentMethodCash', () => {
  let component: PaymentMethodCash;
  let fixture: ComponentFixture<PaymentMethodCash>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentMethodCash]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentMethodCash);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
