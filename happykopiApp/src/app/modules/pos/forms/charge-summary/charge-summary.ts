import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Header } from '../../../../shared/components/header/header';
import { YellowButton } from '../../../../shared/components/yellow-button/yellow-button';
import { ChargeCashSummaryCard } from '../../components/charge-cash-summary-card/charge-cash-summary-card';
import { LongYellowButton } from '../../../../shared/components/long-yellow-button/long-yellow-button';
import { CurrencyPipe } from '@angular/common';
import { ReceiptData, ReceiptModal } from '../../modal/receipt-modal/receipt-modal';

@Component({
  selector: 'app-charge-summary',
  imports: [
    Header,
    YellowButton,
    ChargeCashSummaryCard,
    LongYellowButton,
    ReceiptModal,
    CurrencyPipe,
  ],
  templateUrl: './charge-summary.html',
  styleUrl: './charge-summary.css',
})
export class ChargeSummary implements OnInit {
  receiptData: ReceiptData | null = null;
  showReceiptModal = false;

  constructor(private router: Router) {}

  ngOnInit() {
    const storedReceipt = localStorage.getItem('lastReceipt');
    if (storedReceipt) {
      this.receiptData = JSON.parse(storedReceipt);
    } else { 
      this.router.navigate(['/app/orders/cart']);
    }
  }

  printTransaction() {
    this.showReceiptModal = true;
  }

  closeReceiptModal() {
    this.showReceiptModal = false;
  }

  newOrder() {
    localStorage.removeItem('orders');
    localStorage.setItem('lastOrderID', '0');
    localStorage.removeItem('lastReceipt');
 
    this.router.navigate(['/app/orders']);
}
}
