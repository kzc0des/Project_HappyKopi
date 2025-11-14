import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TransactionListItemDto } from '../../../../core/dtos/transaction/transaction-list-item.dto';

@Component({
  selector: 'app-transaction-payment-card',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './transaction-payment-card.html',
  styleUrls: ['./transaction-payment-card.css'],
})
export class TransactionPaymentCard {
  @Input() paymentMethod: 'cash' | 'gcash' = 'gcash';
  @Input() transactionPayment!: TransactionListItemDto;

  @Output() cardClick = new EventEmitter<number>();
  onClick() {
    this.cardClick.emit(Number(this.transactionPayment.orderId));
  }
}