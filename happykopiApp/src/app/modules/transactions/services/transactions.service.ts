import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api/api.service';
import { Observable } from 'rxjs';
import { TransactionSummaryDto } from '../../../core/dtos/transaction/transaction-summary.dto';
import { TransactionListItemDto } from '../../../core/dtos/transaction/transaction-list-item.dto';
import { TransactionDetailsDto } from '../../../core/dtos/transaction/transaction-detail.dto';


@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  private readonly controllerPath = 'Transactions';

  constructor(private readonly apiService: ApiService) {}

  getDailySummary(): Observable<TransactionSummaryDto> {
    return this.apiService.get<TransactionSummaryDto>(`${this.controllerPath}/summary`);
  }

  getTransactionHistoryToday(): Observable<TransactionListItemDto[]> {
    return this.apiService.get<TransactionListItemDto[]>(`${this.controllerPath}/history`);
  }

  getTransactionDetails(orderId: number): Observable<TransactionDetailsDto> {
    return this.apiService.get<TransactionDetailsDto>(`${this.controllerPath}/${orderId}`);
  }
}
