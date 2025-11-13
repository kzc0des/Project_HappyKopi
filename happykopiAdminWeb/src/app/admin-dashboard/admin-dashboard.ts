import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DashboardService, TransactionSummaryDto, ChartPointDto } from '../services/dashboard.service';
import { AdminDashboardTransaction } from '../admin-components/admin-dashboard-transaction/admin-dashboard-transaction';
import { AdminLineChart } from '../admin-components/admin-line-chart/admin-line-chart';
import { DashboardCard } from '../admin-components/dashboard-card/dashboard-card';
import { DashboardCashPayment } from '../admin-components/dashboard-cash-payment/dashboard-cash-payment';
import { DashboardGcashPayment } from '../admin-components/dashboard-gcash-payment/dashboard-gcash-payment';
import { TransHistory } from '../admin-components/trans-history/trans-history';

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

  currentDate: Date = new Date();
  isDropdownOpen = false;
  isSignOutModalOpen = false;

  // Dashboard metrics
  totalSales = '₱0.00';
  totalTransactions = '0';
  cashTransactionCount = 0;
  cashTransactionAmount = 0;
  gcashPaymentCount = 0;
  gcashPaymentAmount = 0;

  // ✅ Added missing property to fix template error
  transactionHistory: any[] = [];

  selectedPeriod: 'today' | 'this-week' | 'this-month' = 'today';

  constructor(
    private router: Router,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.loadSummary('today');
    this.loadChart('today');
  }

  loadSummary(period: 'today' | 'this-week' | 'this-month'): void {
    this.isDropdownOpen = false;

    let request$;
    if (period === 'today') request$ = this.dashboardService.getToday();
    else if (period === 'this-week') request$ = this.dashboardService.getThisWeek();
    else request$ = this.dashboardService.getThisMonth();

    request$.subscribe({
      next: (data: TransactionSummaryDto) => {
        this.totalSales = `₱${data.totalSales.toFixed(2)}`;
        this.totalTransactions = data.totalTransactions.toString();
        this.cashTransactionCount = data.cashSummary.totalTransactions;
        this.cashTransactionAmount = data.cashSummary.totalAmount;
        this.gcashPaymentCount = data.cashlessSummary.totalTransactions;
        this.gcashPaymentAmount = data.cashlessSummary.totalAmount;
      },
      error: (err: any) => {
        console.error('Failed to load dashboard summary:', err);
      }
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
      error: (err: any) => console.error('Failed to load chart data:', err)
    });
  }

  changePeriod(period: 'today' | 'this-week' | 'this-month'): void {
    this.selectedPeriod = period;
    this.loadSummary(period);
    this.loadChart(period);
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  openSignOutModal(): void {
    this.isSignOutModalOpen = true;
    this.isDropdownOpen = false;
  }

  closeSignOutModal(): void {
    this.isSignOutModalOpen = false;
  }

  confirmSignOut(): void {
    console.log('User signed out');
    this.closeSignOutModal();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown-container')) {
      this.isDropdownOpen = false;
    }
  }
}
