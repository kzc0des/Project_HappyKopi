import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionsService } from '../../services/transactions.service';
import { TransactionCard } from "../../components/transaction-card/transaction-card";
import { TransactionIndividualCard } from "../../components/transaction-individual-card/transaction-individual-card";
import { TransactionPaymentCard } from "../../components/transaction-payment-card/transaction-payment-card";
import { TransactionListItemDto } from '../../../../core/dtos/transaction/transaction-list-item.dto';
import { TransactionSummaryDto } from '../../../../core/dtos/transaction/transaction-summary.dto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transaction-home',
  standalone: true,
  imports: [
    CommonModule,
    TransactionCard,
    TransactionIndividualCard,
    TransactionPaymentCard
  ],
  templateUrl: './transaction-home.html',
  styleUrls: ['./transaction-home.css']
})
export class TransactionHome implements OnInit {
  private transactionsService = inject(TransactionsService);

  cashTotal: number = 0;
  cashTransactions: number = 0;
  gcashTotal: number = 0;
  gcashTransactions: number = 0;
  transactions: TransactionListItemDto[] = [];
  summary?: TransactionSummaryDto;

  ngOnInit(): void {
    this.loadHistory();   
    this.loadSummary();  
  }

  private loadHistory(): void {
    this.transactionsService.getTransactionHistoryToday().subscribe({
      next: (transactions) => {
        this.transactions = transactions;

        this.cashTransactions = this.transactions.filter(
          t => this.getPaymentTypeFlag(t.paymentMethod) === 'cash'
        ).length;

        this.gcashTransactions = this.transactions.filter(
          t => this.getPaymentTypeFlag(t.paymentMethod) === 'gcash'
        ).length;

        this.cashTotal = this.transactions
        .filter(t => this.getPaymentTypeFlag(t.paymentMethod) === 'cash')
        .reduce((sum, t) => sum + (t.totalAmount ?? 0), 0);

        this.gcashTotal = this.transactions
          .filter(t => this.getPaymentTypeFlag(t.paymentMethod) === 'gcash')
          .reduce((sum, t) => sum + (t.totalAmount ?? 0), 0);

        console.log("Cash transactions:", this.cashTransactions);
        console.log("G-Cash transactions:", this.gcashTransactions);
        console.log("Cash Total:", this.cashTotal);
        console.log("G-Cash Total:", this.gcashTotal);
        console.log("Cash totals:", this.transactions.map(t => t.totalAmount));
        console.log("CashTotal:", this.cashTotal);
      },
      error: (err) => console.error('Error loading transaction history:', err)
    });
  }

  private loadSummary(): void {
    this.transactionsService.getDailySummary().subscribe({
      next: (summary) => {
        this.summary = summary;

        console.log("Loaded summary:", summary);
      },
      error: (err) => console.error('Error loading summary:', err)
    });
  }

  getPaymentTypeFlag(paymentMethod: string | number | null | undefined): 'cash' | 'gcash' {
    if (paymentMethod === null || paymentMethod === undefined) return 'gcash';

    const normalized = String(paymentMethod).toLowerCase();

    if (normalized === 'cash' || normalized === '0') return 'cash';
    return 'gcash';
  }

  constructor(private router: Router) {}

  goToTransaction(id: number) {
    this.router.navigate(['/transactions-individual', id]);
  }
}
