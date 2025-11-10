export interface TransactionPaymentDto {
    paymentType: string;
    amountPaid: number;
    change: number;
    referenceNumber?: string;
}