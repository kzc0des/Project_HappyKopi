import { Component } from '@angular/core';
import { TransactionCard } from "../../components/transaction-card/transaction-card";
import { IndividualTransactionCard } from "../../../dashboard/components/individual-transaction-card/individual-transaction-card";
import { TransactionIndividualCard } from "../../components/transaction-individual-card/transaction-individual-card";
import { TransactionPaymentCard } from "../../components/transaction-payment-card/transaction-payment-card";

@Component({
  selector: 'app-transaction-home',
  imports: [TransactionCard, IndividualTransactionCard, TransactionIndividualCard, TransactionPaymentCard],
  templateUrl: './transaction-home.html',
  styleUrl: './transaction-home.css',
})
export class TransactionHome {

}
