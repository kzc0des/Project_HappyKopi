import { Component } from '@angular/core';
import { DescriptionCard } from "../../../../shared/components/description-card/description-card";
import { ChargeItem } from "../../../pos/components/charge-item/charge-item";

@Component({
  selector: 'app-transaction-individual',
  imports: [DescriptionCard, ChargeItem],
  templateUrl: './transaction-individual.html',
  styleUrl: './transaction-individual.css',
})
export class TransactionIndividual {

}
