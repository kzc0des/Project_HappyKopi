import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionPaymentCard } from './transaction-payment-card';

describe('TransactionPaymentCard', () => {
  let component: TransactionPaymentCard;
  let fixture: ComponentFixture<TransactionPaymentCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionPaymentCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionPaymentCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
