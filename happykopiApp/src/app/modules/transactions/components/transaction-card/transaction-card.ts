import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

export interface TransactionCardDto {
  Sales: number;
  Transactions: number;
}

@Component({
  selector: 'app-transaction-card',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './transaction-card.html',
  styleUrls: ['./transaction-card.css'],
})
export class TransactionCard implements OnInit {
  @Input() cardMode: 'sales' | 'transactions' = 'sales';
  @Input() transactionCard?: TransactionCardDto;

  ngOnInit() {
    this.transactionCard = {
      Sales: this.transactionCard?.Sales ?? 0,
      Transactions: this.transactionCard?.Transactions ?? 0,
    };
  }
}