import { ResolveFn } from '@angular/router';
import { TransactionDetailsDto } from '../../../core/dtos/transaction/transaction-detail.dto';
import { Observable, catchError, throwError } from 'rxjs';
import { TransactionsService } from '../services/transactions.service';
import { inject } from '@angular/core';

export const transactionIndivResolverResolver: ResolveFn<TransactionDetailsDto> = 
(route, state): Observable<TransactionDetailsDto> => {

  const transactionsService = inject(TransactionsService);
  const id = route.paramMap.get('id')!;

  return transactionsService.getTransactionDetails(+id).pipe(
    catchError((error) => {
      console.error('Error resolving individual transaction:', error);
      return throwError(() => error);
    })
  );
};
