import { ResolveFn } from '@angular/router';
import { TransactionDetailsDto } from '../../../core/dtos/transaction/transaction-detail.dto';
import { Observable } from 'rxjs';
import { TransactionsService } from '../services/transactions.service';
import { inject } from '@angular/core';

export const transactionIndivResolverResolver: ResolveFn<TransactionDetailsDto[]> = (route, state): Observable<TransactionDetailsDto[]> => {
  const transactionsService = inject(TransactionsService);
  return transactionsService.getTransactionHistoryToday().pipe(
    catchError => {
      console.error('Error resolving transactions:', catchError);
      throw catchError;
    }
  );
};
