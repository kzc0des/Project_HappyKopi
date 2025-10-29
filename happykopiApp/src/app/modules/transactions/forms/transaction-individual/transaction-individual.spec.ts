import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionIndividual } from './transaction-individual';

describe('TransactionIndividual', () => {
  let component: TransactionIndividual;
  let fixture: ComponentFixture<TransactionIndividual>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionIndividual]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionIndividual);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
