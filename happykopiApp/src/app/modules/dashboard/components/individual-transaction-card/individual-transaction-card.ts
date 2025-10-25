import { CurrencyPipe } from '@angular/common';
import { Component, Input } from '@angular/core';

export interface individualTransactionDto {
  OrderID: string,
  PaymentType: string,
  AmountPaid: number,
  Change: number,
  TransactionDate: Date,
  ReferenceNumber: string
}

@Component({
  selector: 'app-individual-transaction-card',
  imports: [CurrencyPipe],
  templateUrl: './individual-transaction-card.html',
  styleUrl: './individual-transaction-card.css',
})
export class IndividualTransactionCard {
@Input() transaction!: individualTransactionDto;
}
