import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargePesoSummaryCard } from './charge-peso-summary-card';

describe('ChargePesoSummaryCard', () => {
  let component: ChargePesoSummaryCard;
  let fixture: ComponentFixture<ChargePesoSummaryCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChargePesoSummaryCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChargePesoSummaryCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
