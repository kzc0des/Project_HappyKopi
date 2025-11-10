import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

export interface TransactionIndividualCardDto {
  TotalAmount: number;
  TotalTransactions: number;
}

@Component({
  selector: 'app-transaction-individual-card',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './transaction-individual-card.html',
  styleUrls: ['./transaction-individual-card.css'],
})
export class TransactionIndividualCard implements OnInit {
  @Input() cardMode: 'cash' | 'gcash' = 'gcash';
  @Input() transactionCard?: TransactionIndividualCardDto;

  ngOnInit() {
    this.transactionCard = {
      TotalAmount: this.transactionCard?.TotalAmount ?? 0,
      TotalTransactions: this.transactionCard?.TotalTransactions ?? 0,
    };
  }
}