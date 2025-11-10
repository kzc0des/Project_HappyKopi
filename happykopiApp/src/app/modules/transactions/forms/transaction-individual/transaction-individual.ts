import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionService } from '../../services/transaction.service';
import { TransactionDetailsDto } from '../../../../core/dtos/transaction/transaction-details-dto';
import { DescriptionCard } from "../../../../shared/components/description-card/description-card";
import { ChargeItem } from "../../../pos/components/charge-item/charge-item";

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
        private transactionService: TransactionService
    ) { }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            if (params['id']) {
                this.loadTransaction(params['id']);
            }
        });
    }

    private loadTransaction(id: string): void {
        this.transactionService.getTransactionById(id).subscribe({
            next: (details) => {
                this.transaction = details;
            },
            error: (error) => {
                console.error('Error loading transaction:', error);
                this.router.navigate(['/transactions']);
            }
        });
    }
}
