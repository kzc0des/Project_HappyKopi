export interface TransactionSummaryDto {
    totalSales: number;
    totalTransactions: number;
    cashSummary: PaymentTypeSummaryDto;
    cashlessSummary: PaymentTypeSummaryDto;
}

export interface PaymentTypeSummaryDto {
    totalAmount: number;
    totalTransactions: number;
}