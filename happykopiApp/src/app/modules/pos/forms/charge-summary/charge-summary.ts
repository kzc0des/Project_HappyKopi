import { Component } from '@angular/core';
import { Header } from '../../../../shared/components/header/header';
import { YellowButton } from '../../../../shared/components/yellow-button/yellow-button'; 
import { ChargeCashSummaryCard } from '../../components/charge-cash-summary-card/charge-cash-summary-card'; 
import { LongYellowButton } from "../../../../shared/components/long-yellow-button/long-yellow-button";

@Component({
  selector: 'app-charge-summary',
  imports: [Header, YellowButton, ChargeCashSummaryCard, LongYellowButton],
  templateUrl: './charge-summary.html',
  styleUrl: './charge-summary.css'
})
export class ChargeSummary {

}
