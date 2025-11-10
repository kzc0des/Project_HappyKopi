import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Observable } from 'rxjs';
import { TransactionService } from '../services/transaction.service';
import { TransactionListItemDto } from '../../../core/dtos/transaction/transaction-list-item-dto';

export const transactionListResolver: ResolveFn<TransactionListItemDto[]> = 
  (route, state): Observable<TransactionListItemDto[]> => {
    const transactionService = inject(TransactionService);
    const queryParams = route.queryParams;

    return transactionService.getTransactions({
      page: queryParams['page'],
      pageSize: queryParams['pageSize'],
      dateFrom: queryParams['dateFrom'],
      dateTo: queryParams['dateTo']
    });
  };