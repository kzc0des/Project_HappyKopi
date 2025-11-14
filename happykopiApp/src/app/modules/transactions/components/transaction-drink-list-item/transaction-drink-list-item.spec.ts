import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionDrinkListItem } from './transaction-drink-list-item';

describe('TransactionDrinkListItem', () => {
  let component: TransactionDrinkListItem;
  let fixture: ComponentFixture<TransactionDrinkListItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionDrinkListItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionDrinkListItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
