import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnavailableProductDto } from '../../../../core/dtos/order/product-availability.dto';
import { LongYellowButton } from "../../../../shared/components/long-yellow-button/long-yellow-button";

export interface UnavailableProductModalData {
  productName: string;
  categoryName: string;
  price: number;
  imageUrl: string;
  unavailableInfo: UnavailableProductDto;
}

@Component({
  selector: 'app-unavailable-product-modal',
  standalone: true,
  imports: [CommonModule, LongYellowButton],
  templateUrl: './unavailable-modal.html',
  styleUrl: './unavailable-modal.css',
})
export class UnavailableProductModal {
  @Input() modalData!: UnavailableProductModalData;
  @Output() closeModal = new EventEmitter<void>();

  getReasonMessage(): string {
    switch (this.modalData.unavailableInfo.reason) {
      case 'EXPIRED_BATCHES':
        return 'Hindi available ang product na ito dahil expired na ang mga ingredients';
      case 'INSUFFICIENT_STOCK':
        return 'Hindi available ang product na ito dahil kulang ang stock ng ingredients';
      default:
        return 'Hindi available ang product na ito';
    }
  }

  getReasonIcon(): string {
    switch (this.modalData.unavailableInfo.reason) {
      case 'EXPIRED_BATCHES':
        return '⚠️';
      case 'INSUFFICIENT_STOCK':
        return '📦';
      default:
        return 'ℹ️';
    }
  }
}