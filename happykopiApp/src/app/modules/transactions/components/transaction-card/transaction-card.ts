import { CurrencyPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

export interface transactionCardDto {
  Sales: number,
  Transactions: number
}

@Component({
  selector: 'app-transaction-card',
  imports: [CurrencyPipe],
  templateUrl: './transaction-card.html',
  styleUrl: './transaction-card.css',
})
export class TransactionCard implements OnInit {
  @Input() cardMode: 'sales' | 'transactions' = 'sales';
  @Input() transactionCard?: transactionCardDto;

  ngOnInit() {
    // Default values: if parent doesn't pass transactionCard, create one
    this.transactionCard = {
      Sales: this.transactionCard?.Sales ?? 0,
      Transactions: this.transactionCard?.Transactions ?? 0
    };
  }
}