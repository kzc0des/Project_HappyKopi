export interface TransactionListItemDto {
    id: number;
    orderId: string;
    paymentType: string;
    amountPaid: number;
    barista: string;
    transactionDate: Date;
    referenceNumber?: string;
}