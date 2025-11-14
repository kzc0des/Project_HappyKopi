import { Component, Input } from '@angular/core';
import { TransactionListItemDto } from '../../../../core/dtos/transaction/transaction-list-item.dto';
import { TransactionItemDto } from '../../../../core/dtos/transaction/transaction-detail.dto';

@Component({
  selector: 'app-transaction-drink-list-item',
  imports: [],
  templateUrl: './transaction-drink-list-item.html',
  styleUrl: './transaction-drink-list-item.css',
})
export class TransactionDrinkListItem {
  @Input() drinkItem!: TransactionItemDto;
}
