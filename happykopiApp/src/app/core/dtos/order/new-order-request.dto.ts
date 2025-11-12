export interface NewOrderRequestDto {
  userId: number;
  totalAmount: number;
  status: string;
  paymentType: string;
  amountPaid: number;
  change: number;
  referenceNumber?: string | null;
  orderItems: NewOrderItemDto[];
}

// new-order-item.dto.ts
export interface NewOrderItemDto {
  productVariantId: number;
  quantity: number;
  price: number;
  subtotal: number;
  modifiers: NewOrderModifierDto[];
}

// new-order-modifier.dto.ts
export interface NewOrderModifierDto {
  modifierId: number;
  quantity: number;
  price: number;
  subtotal: number;
}