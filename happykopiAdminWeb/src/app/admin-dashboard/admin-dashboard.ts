import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AdminDashboardTransaction } from '../admin-components/admin-dashboard-transaction/admin-dashboard-transaction';
import { AdminLineChart } from '../admin-components/admin-line-chart/admin-line-chart';
import { DashboardCard } from '../admin-components/dashboard-card/dashboard-card';
import { DashboardCashPayment } from '../admin-components/dashboard-cash-payment/dashboard-cash-payment';
import { DashboardGcashPayment } from '../admin-components/dashboard-gcash-payment/dashboard-gcash-payment';
import { TransHistory } from '../admin-components/trans-history/trans-history';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css'],
  imports: [AdminDashboardTransaction, AdminLineChart, DashboardCard, DashboardCashPayment, DashboardGcashPayment, TransHistory]
})
export class AdminDashboard implements OnInit {
  currentDate: Date = new Date();
  isDropdownOpen: boolean = false;
  isSignOutModalOpen: boolean = false;

  totalSales: string = '₱2,644.00';
  totalTransactions: string = '56';
  cashTransactionCount: number = 7;
  cashTransactionAmount: number = 322.5;
  gcashPaymentCount: number = 12;
  gcashPaymentAmount: number = 540.0;

  transactionHistory: Array<{
    orderId: string;
    orderTime: string;
    baristaName: string;
    paymentMethod: 'cash' | 'gcash';
    totalPayment: number;
  }> = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadMockData();
  }

  loadMockData(): void {
    this.transactionHistory = [
      {
        orderId: 'HK-A0001',
        orderTime: '10:36 AM',
        baristaName: 'David De Jesus',
        paymentMethod: 'gcash',
        totalPayment: 73.00
      },
      {
        orderId: 'HK-A0002',
        orderTime: '10:36 AM',
        baristaName: 'David De Jesus',
        paymentMethod: 'cash',
        totalPayment: 73.00
      },
      {
        orderId: 'HK-A0003',
        orderTime: '10:36 AM',
        baristaName: 'David De Jesus',
        paymentMethod: 'gcash',
        totalPayment: 73.00
      },
      {
        orderId: 'HK-A0004',
        orderTime: '10:36 AM',
        baristaName: 'David De Jesus',
        paymentMethod: 'cash',
        totalPayment: 73.00
      },
      {
        orderId: 'HK-A0005',
        orderTime: '10:36 AM',
        baristaName: 'David De Jesus',
        paymentMethod: 'gcash',
        totalPayment: 73.00
      },
      {
        orderId: 'HK-A0006',
        orderTime: '10:36 AM',
        baristaName: 'David De Jesus',
        paymentMethod: 'cash',
        totalPayment: 73.00
      },
      {
        orderId: 'HK-A0007',
        orderTime: '10:36 AM',
        baristaName: 'David De Jesus',
        paymentMethod: 'gcash',
        totalPayment: 73.00
      },
      {
        orderId: 'HK-A0008',
        orderTime: '10:36 AM',
        baristaName: 'David De Jesus',
        paymentMethod: 'cash',
        totalPayment: 73.00
      }
    ];
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