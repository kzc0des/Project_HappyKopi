import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TransactionSummaryDto {
  totalSales: number;
  totalTransactions: number;
  cashSummary: {
    totalTransactions: number;
    totalAmount: number;
  };
  cashlessSummary: {
    totalTransactions: number;
    totalAmount: number;
  };
}

export interface ChartPointDto {
  label: string;
  totalSales: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'https://192.168.1.12:5001/api/dashboard';

  constructor(private http: HttpClient) {}

  // --- SUMMARY DATA ---
  getToday(): Observable<TransactionSummaryDto> {
    return this.http.get<TransactionSummaryDto>(`${this.apiUrl}/today`);
  }

  getThisWeek(): Observable<TransactionSummaryDto> {
    return this.http.get<TransactionSummaryDto>(`${this.apiUrl}/this-week`);
  }

  getThisMonth(): Observable<TransactionSummaryDto> {
    return this.http.get<TransactionSummaryDto>(`${this.apiUrl}/this-month`);
  }

  // --- CHART DATA ---
  getChartToday(): Observable<ChartPointDto[]> {
    return this.http.get<ChartPointDto[]>(`${this.apiUrl}/chart/today`);
  }

  getChartThisWeek(): Observable<ChartPointDto[]> {
    return this.http.get<ChartPointDto[]>(`${this.apiUrl}/chart/this-week`);
  }

  getChartThisMonth(): Observable<ChartPointDto[]> {
    return this.http.get<ChartPointDto[]>(`${this.apiUrl}/chart/this-month`);
  }
}
