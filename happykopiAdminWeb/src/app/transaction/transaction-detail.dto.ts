export interface TransactionItemDto {
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  variant: string;
  subtotal: number;
}

export interface TransactionDetailsDto {
  orderId: string;
  total: number;
  transactionDate: string;
  baristaName: string;
  items: TransactionItemDto[];
}
