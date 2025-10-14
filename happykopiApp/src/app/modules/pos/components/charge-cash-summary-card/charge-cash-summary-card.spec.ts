import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeCashSummaryCard } from './charge-cash-summary-card';

describe('ChargeCashSummaryCard', () => {
  let component: ChargeCashSummaryCard;
  let fixture: ComponentFixture<ChargeCashSummaryCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChargeCashSummaryCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChargeCashSummaryCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
