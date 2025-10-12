import { CurrencyPipe, NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { Transaction } from '../../../core/models/transaction.model';
import { Lowstockitem } from '../../../core/models/lowstockitem.model';

@Component({
  selector: 'app-admin-dashboard',
  imports: [NgClass, CurrencyPipe],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard {
  totalSales: number = 0;
  cashTransactions: number = 0;
  cashlessTransactions: number = 0;
  recentTransactions: Transaction[] = [];
  lowStockItems: Lowstockitem[] = [];

  constructor() { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.totalSales = 12530.50;
    this.cashTransactions = 82;
    this.cashlessTransactions = 45;

    this.recentTransactions = [
      { id: 'HK-0156', barista: 'Kyla', time: '2:45 PM', amount: 250.00, paymentMethod: 'Cashless' },
      { id: 'HK-0155', barista: 'John', time: '2:42 PM', amount: 180.00, paymentMethod: 'Cash' },
      { id: 'HK-0154', barista: 'Kyla', time: '2:39 PM', amount: 320.50, paymentMethod: 'Cashless' },
      { id: 'HK-0153', barista: 'Anna', time: '2:35 PM', amount: 150.00, paymentMethod: 'Cash' },
      { id: 'HK-0152', barista: 'John', time: '2:33 PM', amount: 450.00, paymentMethod: 'Cash' },
    ];

    this.lowStockItems = [
      { name: 'Arabica Beans', remaining: '250g', level: 'danger' },
      { name: 'Caramel Syrup', remaining: '1 bottle', level: 'warning' },
      { name: '1L Full Cream Milk', remaining: '3 Liters', level: 'warning' },
    ];
  }
}
