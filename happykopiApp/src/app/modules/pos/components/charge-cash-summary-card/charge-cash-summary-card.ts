import { CurrencyPipe } from '@angular/common';
import { Component, Input } from '@angular/core';

export interface chargeSummaryCardDto {
  Total: number,
  ModeOfPayment: string,
  OrderNumber: string
}

@Component({
  selector: 'app-charge-cash-summary-card',
  imports: [CurrencyPipe],
  templateUrl: './charge-cash-summary-card.html',
  styleUrl: './charge-cash-summary-card.css'
})
export class ChargeCashSummaryCard { 
  @Input() chargeSummary!: chargeSummaryCardDto;
  @Input() mode: 'payment_cash' | 'payment_gcash' | 'total' | 'order-number' = 'payment_cash';
}
