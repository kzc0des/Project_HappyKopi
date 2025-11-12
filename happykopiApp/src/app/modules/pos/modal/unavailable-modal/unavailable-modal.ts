// features/order/modal/unavailable-product-modal/unavailable-product-modal.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnavailableProductDto } from '../../../../core/dtos/order/product-availability.dto';

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
  imports: [CommonModule],
  template: `
    <div class="modal-content-wrapper">
      <div class="modal-header">
        <h3 class="modal-title">
          <span class="warning-icon">{{ getReasonIcon() }}</span>
          Product Not Available
        </h3>
        <button class="close-btn" (click)="closeModal.emit()">✕</button>
      </div>

      <div class="modal-body">
        <div class="product-info">
          <img
            [src]="modalData.imageUrl || 'assets/images/no-image.png'"
            alt="{{ modalData.productName }}"
            class="product-image"
          />
          <div>
            <h4>{{ modalData.productName }}</h4>
            <p class="category">{{ modalData.categoryName }}</p>
            <p class="price">₱{{ modalData.price }}</p>
          </div>
        </div>

        <div class="alert-warning">
          <strong>⚠️ {{ getReasonMessage() }}</strong>
        </div>

        <h5 class="ingredients-title">Ingredient Details:</h5>

        <div class="ingredients-table">
          <table>
            <thead>
              <tr>
                <th>Ingredient</th>
                <th>Required</th>
                <th>Available</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr
                *ngFor="let detail of modalData.unavailableInfo.details"
                [class.expired-row]="detail.expiredBatchCount && detail.expiredBatchCount > 0"
              >
                <td>{{ detail.ingredientName }}</td>
                <td>{{ detail.required }} {{ detail.unitOfMeasure }}</td>
                <td>{{ detail.available }} {{ detail.unitOfMeasure }}</td>
                <td>
                  <span
                    *ngIf="detail.expiredBatchCount && detail.expiredBatchCount > 0"
                    class="badge badge-danger"
                  >
                    {{ detail.expiredBatchCount }} expired batch(es)
                  </span>
                  <span
                    *ngIf="
                      detail.available < detail.required &&
                      (!detail.expiredBatchCount || detail.expiredBatchCount === 0)
                    "
                    class="badge badge-warning"
                  >
                    Kulang {{ detail.required - detail.available }} {{ detail.unitOfMeasure }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="alert-info">
          <small>
            <strong>Note:</strong> Hindi mo muna maorder ang product na ito. Please contact staff
            para ma-restock ang ingredients.
          </small>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-close" (click)="closeModal.emit()">Close</button>
      </div>
    </div>
  `,
  styles: [
    `
      .modal-content-wrapper {
        background: white;
        border-radius: 12px;
        max-width: 600px;
        width: 90vw;
        max-height: 90vh;
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }

      .modal-header {
        padding: 20px;
        border-bottom: 1px solid #e0e0e0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #fff3cd;
      }

      .modal-title {
        margin: 0;
        font-size: 1.5rem;
        color: #856404;
      }

      .warning-icon {
        font-size: 1.8rem;
        margin-right: 10px;
      }

      .close-btn {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #666;
        padding: 0;
        width: 30px;
        height: 30px;
      }

      .close-btn:hover {
        color: #000;
      }

      .modal-body {
        padding: 20px;
        overflow-y: auto;
        flex: 1;
      }

      .product-info {
        display: flex;
        gap: 15px;
        margin-bottom: 20px;
        padding: 15px;
        background: #f8f9fa;
        border-radius: 8px;
      }

      .product-image {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: 8px;
      }

      .category {
        color: #666;
        margin: 5px 0;
      }

      .price {
        font-size: 1.2rem;
        font-weight: bold;
        color: #28a745;
        margin: 5px 0;
      }

      .alert-warning {
        background: #fff3cd;
        border: 1px solid #ffc107;
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 20px;
        color: #856404;
      }

      .alert-info {
        background: #d1ecf1;
        border: 1px solid #bee5eb;
        padding: 15px;
        border-radius: 8px;
        margin-top: 20px;
        color: #0c5460;
      }

      .ingredients-title {
        margin: 20px 0 10px;
        color: #333;
      }

      .ingredients-table {
        overflow-x: auto;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
      }

      th,
      td {
        padding: 10px;
        text-align: left;
        border: 1px solid #dee2e6;
      }

      th {
        background: #f8f9fa;
        font-weight: 600;
        color: #495057;
      }

      .expired-row {
        background: #f8d7da;
      }

      .badge {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.75rem;
        font-weight: 600;
      }

      .badge-danger {
        background: #dc3545;
        color: white;
      }

      .badge-warning {
        background: #ffc107;
        color: #000;
      }

      .modal-footer {
        padding: 15px 20px;
        border-top: 1px solid #e0e0e0;
        display: flex;
        justify-content: flex-end;
      }

      .btn-close {
        padding: 10px 20px;
        background: #6c757d;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 1rem;
      }

      .btn-close:hover {
        background: #5a6268;
      }
    `,
  ],
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