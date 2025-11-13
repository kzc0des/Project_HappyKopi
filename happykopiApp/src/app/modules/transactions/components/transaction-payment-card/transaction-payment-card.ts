import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TransactionListItemDto } from '../../../../core/dtos/transaction/transaction-list-item.dto';

@Component({
  selector: 'app-transaction-payment-card',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './transaction-payment-card.html',
  styleUrls: ['./transaction-payment-card.css'],
})
export class TransactionPaymentCard {
  @Input() paymentType: 'cash' | 'gcash' = 'gcash';
  @Input() transactionPayment!: TransactionListItemDto;  
}
