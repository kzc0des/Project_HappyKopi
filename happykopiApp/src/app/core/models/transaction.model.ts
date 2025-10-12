export interface Transaction {
    id: string;
    barista: string;
    time: string;
    amount: number;
    paymentMethod: 'Cash' | 'Cashless';
}
