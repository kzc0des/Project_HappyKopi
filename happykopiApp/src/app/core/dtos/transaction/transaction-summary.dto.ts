import { TransactionItemDto } from "./transaction-detail.dto";
import { TransactionListItemDto } from "./transaction-list-item.dto";

export interface TransactionSummaryDto {
  totalSalesToday: number;
  transactionsToday: number;
  cashPayments: TransactionListItemDto;
  cashlessPayments: TransactionListItemDto;
}