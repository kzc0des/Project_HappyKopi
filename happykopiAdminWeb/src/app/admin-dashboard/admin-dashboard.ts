import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DashboardService } from '../services/dashboard.service';
import { AdminDashboardTransaction } from '../admin-components/admin-dashboard-transaction/admin-dashboard-transaction';
import { DashboardCard } from '../admin-components/dashboard-card/dashboard-card';
import { DashboardCashPayment } from '../admin-components/dashboard-cash-payment/dashboard-cash-payment';
import { DashboardGcashPayment } from '../admin-components/dashboard-gcash-payment/dashboard-gcash-payment';
import { TransHistory } from '../admin-components/trans-history/trans-history';
import { TransactionListItemDto } from '../transaction/transaction-list-item.dto';
import { TransactionSummaryDto } from '../transaction/transaction-summary.dto';
import { ChartPointDto } from '../transaction/chart-point.dto';
import { AdminLineChart } from '../admin-components/admin-line-chart/admin-line-chart';
import { AuthService } from '../auth/login/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    AdminDashboardTransaction,
    AdminLineChart,
    DashboardCard,
    DashboardCashPayment,
    DashboardGcashPayment,
    TransHistory
  ],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboard implements OnInit {
  @ViewChild(AdminLineChart) lineChartComponent!: AdminLineChart;

  isDropdownOpen = false;
  isSignOutModalOpen = false;

  totalSales = '₱0.00';
  totalTransactions = '0';
  cashTransactionCount = 0;
  cashTransactionAmount = 0;
  gcashPaymentCount = 0;
  gcashPaymentAmount = 0;

  transactionHistory: TransactionListItemDto[] = [];
  selectedPeriod: 'today' | 'this-week' | 'this-month' = 'today';

  constructor(
    private router: Router,
    private dashboardService: DashboardService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadSummary('today');
    this.loadChart('today');
    this.loadTransactionHistory();
  }

  loadSummary(period: 'today' | 'this-week' | 'this-month'): void {
    this.isDropdownOpen = false;
    let request$;

    if (period === 'today') request$ = this.dashboardService.getTodaySummary();
    else if (period === 'this-week') request$ = this.dashboardService.getWeeklySummary();
    else request$ = this.dashboardService.getMonthlySummary();

    request$.subscribe({
      next: (data: TransactionSummaryDto) => {
        this.totalSales = this.formatCurrency(data.totalSalesToday);
        this.totalTransactions = data.transactionsToday.toString();
        this.cashTransactionCount = data.cashPayments;
        this.gcashPaymentCount = data.cashlessPayments;

        const totalTx = data.transactionsToday || 1;
        this.cashTransactionAmount = (data.totalSalesToday * data.cashPayments) / totalTx;
        this.gcashPaymentAmount = (data.totalSalesToday * data.cashlessPayments) / totalTx;
      },
      error: (err) => console.error('Failed to load summary:', err)
    });
  }

  loadChart(period: 'today' | 'this-week' | 'this-month'): void {
    let chartRequest$;
    if (period === 'today') chartRequest$ = this.dashboardService.getChartToday();
    else if (period === 'this-week') chartRequest$ = this.dashboardService.getChartThisWeek();
    else chartRequest$ = this.dashboardService.getChartThisMonth();

    chartRequest$.subscribe({
      next: (points: ChartPointDto[]) => {
        const labels = points.map(p => p.label);
        const values = points.map(p => p.totalSales);
        if (this.lineChartComponent?.updateChartData) {
          this.lineChartComponent.updateChartData(labels, values);
        }
      },
      error: (err) => console.error('Failed to load chart:', err)
    });
  }

  loadTransactionHistory(): void {
    this.dashboardService.getTransactionHistory().subscribe({
      next: (data) => this.transactionHistory = data,
      error: (err) => console.error('Failed to load transaction history:', err)
    });
  }

  changePeriod(period: 'today' | 'this-week' | 'this-month'): void {
    this.selectedPeriod = period;
    this.loadSummary(period);
    this.loadChart(period);
  }

  toggleDropdown(): void { this.isDropdownOpen = !this.isDropdownOpen; }
  openSignOutModal(): void { this.isSignOutModalOpen = true; this.isDropdownOpen = false; }
  closeSignOutModal(): void { this.isSignOutModalOpen = false; }
  confirmSignOut(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.closeSignOutModal();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown-container')) this.isDropdownOpen = false;
  }

  formatOrderTime(date: Date): string {
    return new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }

  formatCurrency(amount: number | undefined): string {
    if (!amount) return '₱0.00';
    return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount);
  }
}
