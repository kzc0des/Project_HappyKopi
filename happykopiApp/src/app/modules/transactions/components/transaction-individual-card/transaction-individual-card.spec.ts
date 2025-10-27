import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionIndividualCard } from './transaction-individual-card';

describe('TransactionIndividualCard', () => {
  let component: TransactionIndividualCard;
  let fixture: ComponentFixture<TransactionIndividualCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionIndividualCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionIndividualCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
