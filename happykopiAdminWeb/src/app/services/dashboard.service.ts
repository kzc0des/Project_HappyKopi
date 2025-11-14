import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { TransactionSummaryDto } from '../transaction/transaction-summary.dto';
import { ChartPointDto } from '../transaction/chart-point.dto';
import { TransactionListItemDto } from '../transaction/transaction-list-item.dto';
import { environment } from '../environments/environment.development';
import { ApiService } from './api.service';
import { SignalrService } from './signalr.service';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private transactionUpdateSubject = new Subject<void>();
  public transactionUpdated$ = this.transactionUpdateSubject.asObservable();

  constructor(private api: ApiService, private signalRService: SignalrService) {
    this.signalRService.startConnection();
    this.signalRService.on('ReceiveTransactionUpdate', () => {
      console.log('Transaction update received from SignalR.');
      this.transactionUpdateSubject.next();
    });
  }

  // ===== SUMMARY METHODS =====
  getTodaySummary(): Observable<TransactionSummaryDto> {
    return this.api.get<TransactionSummaryDto>('dashboard/today');
  }

  getWeeklySummary(): Observable<TransactionSummaryDto> {
    return this.api.get<TransactionSummaryDto>('dashboard/this-week');
  }

  getMonthlySummary(): Observable<TransactionSummaryDto> {
    return this.api.get<TransactionSummaryDto>('dashboard/this-month');
  }

  // ===== CHART METHODS =====
  getChartToday(): Observable<ChartPointDto[]> {
    return this.api.get<ChartPointDto[]>('dashboard/chart/today');
  }

  getChartThisWeek(): Observable<ChartPointDto[]> {
    return this.api.get<ChartPointDto[]>('dashboard/chart/this-week');
  }

  getChartThisMonth(): Observable<ChartPointDto[]> {
    return this.api.get<ChartPointDto[]>('dashboard/chart/this-month');
  }

  // ===== TRANSACTION HISTORY =====
  getTransactionHistory(): Observable<TransactionListItemDto[]> {
    return this.api.get<TransactionListItemDto[]>('dashboard/transactions/history');
  }
}