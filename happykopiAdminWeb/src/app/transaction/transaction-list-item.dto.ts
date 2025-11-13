export interface TransactionListItemDto {
  orderId: number;
  orderNumber: string;  
  baristaName: string;
  transactionDate: Date;
  total: number;
  paymentMethod: string;
}