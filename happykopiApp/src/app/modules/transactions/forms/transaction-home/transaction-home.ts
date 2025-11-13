import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionsService } from '../../services/transactions.service';
import { TransactionCard } from "../../components/transaction-card/transaction-card";
import { TransactionIndividualCard } from "../../components/transaction-individual-card/transaction-individual-card";
import { TransactionPaymentCard } from "../../components/transaction-payment-card/transaction-payment-card";
import { TransactionListItemDto } from '../../../../core/dtos/transaction/transaction-list-item.dto';
import { TransactionSummaryDto } from '../../../../core/dtos/transaction/transaction-summary.dto';

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

  transactions: TransactionListItemDto[] = [];
  summary?: TransactionSummaryDto;

  ngOnInit(): void {
    console.log('[TransactionHome] ngOnInit called - START');
    
    this.loadSummary();
    this.loadHistory();
  }

  private loadSummary(): void {
    this.transactionsService.getDailySummary().subscribe({
      next: (summary) => this.summary = summary,
      error: (err) => console.error('Error loading summary:', err)
    });
  }

  private loadHistory(): void {
    this.transactionsService.getTransactionHistoryToday().subscribe({
      next: (transactions) => this.transactions = transactions,
      error: (err) => console.error('Error loading history:', err)
    });
  }

  getPaymentTypeFlag(paymentType: string): 'cash' | 'gcash' {
    const type = paymentType;
    return type === 'cash' ? 'cash' : 'gcash';
  }
}
