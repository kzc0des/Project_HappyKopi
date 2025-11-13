import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionsService } from '../../services/transactions.service';
import { DescriptionCard } from "../../../../shared/components/description-card/description-card";
import { ChargeItem } from "../../../pos/components/charge-item/charge-item";
import { TransactionDetailsDto } from '../../../../core/dtos/transaction/transaction-detail.dto';
import { TransactionListItemDto } from '../../../../core/dtos/transaction/transaction-list-item.dto';

@Component({
  selector: 'app-transaction-individual',
  standalone: true,
  imports: [CommonModule, DescriptionCard, ChargeItem],
  templateUrl: './transaction-individual.html',
  styleUrls: ['./transaction-individual.css']
})
export class TransactionIndividual implements OnInit {
  transaction?: TransactionDetailsDto;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private transactionsService: TransactionsService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loadTransaction(id);
      }
    });
  }

  private loadTransaction(id: string): void {
  this.transactionsService.getTransactionDetails(+id).subscribe({
    next: (details: TransactionDetailsDto) => {
      this.transaction = details; // Use the correct DTO here
    },
    error: (error) => {
      console.error('Error loading transaction:', error);
      this.router.navigate(['/transactions']);
    }
  });
}
}
