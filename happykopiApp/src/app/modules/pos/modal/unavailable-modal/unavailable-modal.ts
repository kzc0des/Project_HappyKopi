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
      case 'EXPIRED BATCHES':
        return 'Product not available due to expired ingredients.';
      case 'INSUFFICIENT STOCK':
        return 'Product not available due to insufficient stock.';
      default:
        return 'This product is not available';
    }
  }
}