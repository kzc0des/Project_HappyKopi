import { CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface ReceiptData {
  orderNumber: string;
  baristaName: string;
  paymentType: string;
  referenceNumber: string | null;
  totalAmount: number;
  orders: any[];
  timestamp: string;
}

@Component({
  selector: 'app-receipt-modal',
  imports: [CurrencyPipe],
  templateUrl: './receipt-modal.html',
  styleUrl: './receipt-modal.css',
})

export class ReceiptModal {
  @Input() receipt!: ReceiptData;
  @Output() closeModal = new EventEmitter<void>();

  getDate(timestamp: string): string {
    return new Date(timestamp).toLocaleDateString('en-PH');
  }

  getTime(timestamp: string): string {
    return new Date(timestamp).toLocaleTimeString('en-PH');
  }

  onClose() {
    this.closeModal.emit();
  }
}
