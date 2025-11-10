import { OrderItemDto } from './order-item-dto';
import { TransactionPaymentDto } from './transaction-payment-dto';

export interface TransactionDetailsDto {
    orderId: string;
    barista: string;
    transactionDate: Date;
    items: OrderItemDto[];
    payments: TransactionPaymentDto[];
    totalAmount: number;
}