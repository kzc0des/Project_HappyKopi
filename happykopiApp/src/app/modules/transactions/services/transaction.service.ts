import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { TransactionSummaryDto } from '../../../core/dtos/transaction/transaction-summary-dto';
import { TransactionDetailsDto } from '../../../core/dtos/transaction/transaction-details-dto';
import { TransactionListItemDto } from '../../../core/dtos/transaction/transaction-list-item-dto';

@Injectable({
    providedIn: 'root'
})
export class TransactionService {
    private apiUrl = `${environment.apiBaseUrl}/transactions`;

    constructor(private http: HttpClient) {}

    // Get daily transaction summary including cash and cashless breakdowns
    getDailySummary(date: Date = new Date()): Observable<TransactionSummaryDto> {
        const formattedDate = date.toISOString().split('T')[0];
        return this.http.get<TransactionSummaryDto>(`${this.apiUrl}/daily-summary/${formattedDate}`);
    }

    // Get transaction details by ID
    getTransactionById(id: string): Observable<TransactionDetailsDto> {
        return this.http.get<TransactionDetailsDto>(`${this.apiUrl}/${id}`);
    }

    // Get paginated transaction history
    getTransactionHistory(page: number = 1, pageSize: number = 10): Observable<TransactionListItemDto[]> {
        return this.http.get<TransactionListItemDto[]>(
            `${this.apiUrl}/history?page=${page}&pageSize=${pageSize}`
        );
    }

    // Get transactions by date range
    getTransactionsByDateRange(
        startDate: Date,
        endDate: Date
    ): Observable<TransactionListItemDto[]> {
        const formattedStartDate = startDate.toISOString().split('T')[0];
        const formattedEndDate = endDate.toISOString().split('T')[0];
        return this.http.get<TransactionListItemDto[]>(
            `${this.apiUrl}/range?startDate=${formattedStartDate}&endDate=${formattedEndDate}`
        );
    }

    // Get transactions by payment type
    getTransactionsByPaymentType(
        paymentType: string,
        page: number = 1,
        pageSize: number = 10
    ): Observable<TransactionListItemDto[]> {
        return this.http.get<TransactionListItemDto[]>(
            `${this.apiUrl}/by-payment/${paymentType}?page=${page}&pageSize=${pageSize}`
        );
    }


    getTransactions(options?: { page?: number; pageSize?: number; dateFrom?: string | Date; dateTo?: string | Date; startDate?: string | Date; endDate?: string | Date; paymentType?: string; }): Observable<TransactionListItemDto[]> {
        const params: string[] = [];

        if (options) {
            if (options.page != null) params.push(`page=${options.page}`);
            if (options.pageSize != null) params.push(`pageSize=${options.pageSize}`);

            const from = options.dateFrom;
            const to = options.dateTo;

            if (from) {
                const df = from instanceof Date ? from.toISOString().split('T')[0] : from;
                params.push(`dateFrom=${df}`);
            }
            if (to) {
                const dt = to instanceof Date ? to.toISOString().split('T')[0] : to;
                params.push(`dateTo=${dt}`);
            }

            if (options.paymentType) params.push(`paymentType=${encodeURIComponent(options.paymentType)}`);
        }

        const query = params.length ? `?${params.join('&')}` : '';
        return this.http.get<TransactionListItemDto[]>(`${this.apiUrl}${query}`);
    }
}
