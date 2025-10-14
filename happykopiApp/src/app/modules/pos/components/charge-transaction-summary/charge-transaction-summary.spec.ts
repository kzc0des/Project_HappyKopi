import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeTransactionSummary } from './charge-transaction-summary';

describe('ChargeTransactionSummary', () => {
  let component: ChargeTransactionSummary;
  let fixture: ComponentFixture<ChargeTransactionSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChargeTransactionSummary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChargeTransactionSummary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
