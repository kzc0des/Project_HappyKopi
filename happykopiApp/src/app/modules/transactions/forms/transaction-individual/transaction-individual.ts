import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionsService } from '../../services/transactions.service';
import { DescriptionCard } from "../../../../shared/components/description-card/description-card";
import { TransactionDetailsDto } from '../../../../core/dtos/transaction/transaction-detail.dto';
import { TransactionListItemDto } from '../../../../core/dtos/transaction/transaction-list-item.dto';
import { TransactionDrinkListItem } from '../../components/transaction-drink-list-item/transaction-drink-list-item';

@Component({
  selector: 'app-transaction-individual',
  standalone: true,
  imports: [CommonModule, DescriptionCard, TransactionDrinkListItem],
  templateUrl: './transaction-individual.html',
  styleUrls: ['./transaction-individual.css']
})
export class TransactionIndividual implements OnInit {
  transaction?: TransactionDetailsDto;
  paymentMethodTran: { paymentMethod: string } = { paymentMethod: '' }; 

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
        this.transaction = details;

        this.transactionsService.getTransactionHistoryToday().subscribe({
          next: (list: TransactionListItemDto[]) => {
            const match = list.find(t => t.orderId === details.orderId);
            if (match) {
              this.paymentMethodTran.paymentMethod = match.paymentMethod;
            }
          }
        });
      },
      error: (error) => {
        console.error('Error loading transaction:', error);
        this.router.navigate(['/transactions']);
      }
    });
  }
}
