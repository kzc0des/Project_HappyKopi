import { ResolveFn } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';
import { TransactionsService } from '../services/transactions.service';
import { inject } from '@angular/core';
import { TransactionListItemDto } from '../../../core/dtos/transaction/transaction-list-item.dto';

export const transactionsResolver: ResolveFn<TransactionListItemDto[]> = 
(route, state): Observable<TransactionListItemDto[]> => {
  
  const transactionsService = inject(TransactionsService);

  return transactionsService.getTransactionHistoryToday().pipe(
    catchError((error) => {
      console.error('Error resolving transactions:', error);
      return throwError(() => error);
    })
  );
};