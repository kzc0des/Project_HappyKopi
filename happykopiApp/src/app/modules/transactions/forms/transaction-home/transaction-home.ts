import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TransactionCard } from "../../components/transaction-card/transaction-card";
import { TransactionIndividualCard } from "../../components/transaction-individual-card/transaction-individual-card";
import { TransactionPaymentCard } from "../../components/transaction-payment-card/transaction-payment-card";
import { TransactionService } from '../../services/transaction.service';
import { TransactionListItemDto } from '../../../../core/dtos/transaction/transaction-list-item-dto';
import { TransactionSummaryDto } from '../../../../core/dtos/transaction/transaction-summary-dto';

@Component({
  selector: 'app-transaction-home',
  standalone: true,
  imports: [CommonModule, TransactionCard, TransactionIndividualCard, TransactionPaymentCard],
  templateUrl: './transaction-home.html',
  styleUrls: ['./transaction-home.css']
})
export class TransactionHome implements OnInit {
  transactions: TransactionListItemDto[] = [];
  salesTotal: number = 0;
  transactionsCount: number = 0;
  cashTotal: number = 0;
  cashTransactionsCount: number = 0;
  cashlessTotal: number = 0;
  cashlessTransactionsCount: number = 0;

  constructor(
    private transactionService: TransactionService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Get daily summary
    this.transactionService.getDailySummary().subscribe((summary: TransactionSummaryDto) => {
      this.salesTotal = summary.totalSales;
      this.transactionsCount = summary.totalTransactions;
      this.cashTotal = summary.cashSummary.totalAmount;
      this.cashTransactionsCount = summary.cashSummary.totalTransactions;
      this.cashlessTotal = summary.cashlessSummary.totalAmount;
      this.cashlessTransactionsCount = summary.cashlessSummary.totalTransactions;
    });

    // Get transaction history
    this.transactionService.getTransactionHistory().subscribe(transactions => {
      this.transactions = transactions;
    });
  }

  getPaymentTypeFlag(paymentType: string): 'cash' | 'gcash' {
    return paymentType.toLowerCase().includes('cash') &&
           !paymentType.toLowerCase().includes('cashless')
           ? 'cash'
           : 'gcash';
  }
}