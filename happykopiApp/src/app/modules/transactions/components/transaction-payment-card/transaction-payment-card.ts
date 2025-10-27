import { CurrencyPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

export interface transactionPaymentDto {
  OrderID: string;
  AmountPaid: number;
  Change: number;
  TransactionDate: Date;
  ReferenceNumber: string;
  TransactionWho: string;
}

@Component({
  selector: 'app-transaction-payment-card',
  imports: [CurrencyPipe],
  templateUrl: './transaction-payment-card.html',
  styleUrl: './transaction-payment-card.css',
})
export class TransactionPaymentCard implements OnInit {
  @Input() paymentType: 'cash' | 'gcash' = 'gcash';
  @Input() transactionPayment!: transactionPaymentDto;

  ngOnInit() {
    // Default values: if parent doesn't pass transactionCard, create one
    this.transactionPayment = {
      OrderID: this.transactionPayment?.OrderID ?? 'HK-0000',
      AmountPaid: this.transactionPayment?.AmountPaid ?? 0,
      Change: this.transactionPayment?.Change ?? 0,
      TransactionDate: this.transactionPayment?.TransactionDate ?? 'Unknown',
      ReferenceNumber: this.transactionPayment?.ReferenceNumber ?? 0,
      TransactionWho: this.transactionPayment?.TransactionWho ?? 'Unknown',
    };
  }
}
