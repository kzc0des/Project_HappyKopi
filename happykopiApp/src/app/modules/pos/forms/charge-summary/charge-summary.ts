import { Component } from '@angular/core';
import { Header } from '../../../../shared/components/header/header';
import { YellowButton } from '../../../../shared/components/yellow-button/yellow-button'; 
import { ChargeCashSummaryCard } from '../../components/charge-cash-summary-card/charge-cash-summary-card';
import { ChargeGcashSummaryCard } from '../../components/charge-gcash-summary-card/charge-gcash-summary-card';
import { ChargePesoSummaryCard } from '../../components/charge-peso-summary-card/charge-peso-summary-card';
import { ChargeTransactionSummary } from '../../components/charge-transaction-summary/charge-transaction-summary';

@Component({
  selector: 'app-charge-summary',
  imports: [Header, YellowButton, ChargeCashSummaryCard, ChargeGcashSummaryCard, ChargePesoSummaryCard, ChargeTransactionSummary],
  templateUrl: './charge-summary.html',
  styleUrl: './charge-summary.css'
})
export class ChargeSummary {

}
