export interface NewOrderResponseDto {
  orderId: number;
  orderNumber: string;
  status: string;
  message: string;
  orderDate: string;
  totalAmount: number;
  amountPaid: number;
  change: number;
}
 
export interface NewOrderDetailsDto {
  orderId: number;
  orderNumber: string;
  orderDate: string;
  status: string;
  userId: number;
  customerName: string;
  items: NewOrderItemDetailDto[];
  paymentType: string;
  subtotal: number;
  totalAmount: number;
  amountPaid: number;
  change: number;
  referenceNumber?: string | null;
}
 
export interface NewOrderItemDetailDto {
  orderItemId: number;
  productName: string;
  size: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  modifiers: NewOrderModifierDetailDto[];
}
 
export interface NewOrderModifierDetailDto {
  modifierName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}
 
export interface NewOrderErrorDto {
  status: string;
  message: string;
  errors: string[];
}