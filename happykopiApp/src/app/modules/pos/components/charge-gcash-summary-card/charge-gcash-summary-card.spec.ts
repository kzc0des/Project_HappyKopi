import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeGcashSummaryCard } from './charge-gcash-summary-card';

describe('ChargeGcashSummaryCard', () => {
  let component: ChargeGcashSummaryCard;
  let fixture: ComponentFixture<ChargeGcashSummaryCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChargeGcashSummaryCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChargeGcashSummaryCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
