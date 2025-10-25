import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualTransactionCard } from './individual-transaction-card';

describe('IndividualTransactionCard', () => {
  let component: IndividualTransactionCard;
  let fixture: ComponentFixture<IndividualTransactionCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndividualTransactionCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndividualTransactionCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
