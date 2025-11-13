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
 
export interface NewOrderItemDto {
  productVariantId: number;
  quantity: number;
  price: number;
  subtotal: number;
  modifiers: NewOrderModifierDto[];
}
 
export interface NewOrderModifierDto {
  modifierId: number;
  quantity: number;
  price: number;
  subtotal: number;
}