import { Component, OnInit } from '@angular/core';
import { Itemcard } from '../../../shared/components/itemcard/itemcard';
import { DateCard } from '../../../shared/components/date-card/date-card';
import { ExpiryDateCard } from '../components/expiry-date-card/expiry-date-card';
import { FormsModule } from '@angular/forms';
import { StockItemBatchForCreateDto } from '../../../core/dtos/stockitem/stock-item-batch-for-create-dto';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderService } from '../../../core/services/header/header.service';
import { ConfirmationService } from '../../../core/services/confirmation/confirmation.service';
import { InventoryService } from '../services/inventory.service';
import { StockItemType } from '../../../core/enums/stock-item-type';
import { LoadingService } from '../../../core/services/loading/loading.service';
import { AlertService } from '../../../core/services/alert/alert.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-inventory-batch-add',
  imports: [Itemcard, DateCard, ExpiryDateCard, FormsModule],
  templateUrl: './inventory-batch-add.html',
  styleUrl: './inventory-batch-add.css',
})
export class InventoryBatchAdd implements OnInit {
  batchDetail: StockItemBatchForCreateDto = { stockItemId: 0, quantityAdded: 0 };
  dateAdded: Date = new Date();
  private actionSubscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private headerService: HeaderService,
    private confirmationService: ConfirmationService,
    private inventoryService: InventoryService,
    private router: Router,
    private loadingService: LoadingService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.actionSubscription = this.headerService.action$.subscribe(async action => {
      if(action === "SAVE"){
        const confirmation = await this.confirmationService.confirm(
          "Save Batch?",
          "Make sure that all the details are correct and complete.",
          "primary",
          "Save",
          "Cancel"
        )

        if (confirmation) {
          this.saveBatch();
        }
      }
    })
  }

  saveBatch(): void {
    const stockItemIdString = this.route.snapshot.paramMap.get('itemid');
    const itemTypeString = this.route.snapshot.paramMap.get('itemtype');

    if (!stockItemIdString || !itemTypeString) {
      console.error("Stock Item ID not found in route");
      return;
    }

    const itemType = StockItemType[itemTypeString as keyof typeof StockItemType];

    this.batchDetail.stockItemId = +stockItemIdString;
    console.log(`Batch Payload: ${JSON.stringify(this.batchDetail)}`)
    
    this.loadingService.show();
    this.inventoryService.addStockItemBatch(this.batchDetail).subscribe({
      next: async () => {
        this.loadingService.hide();
        await this.alertService.show('Success', 'New batch has been added successfully.', 'success');
        this.router.navigate(['../..'], { relativeTo: this.route, replaceUrl: true });
      },
      error: async (err) => {
        this.loadingService.hide();
        console.error("Error adding stock item batch", err);
        let errorMessage = "An unexpected error occurred. Please try again.";
        if (err.error && err.error.message) {
          errorMessage = err.error.message;
        } else if (typeof err.error === 'string') {
          errorMessage = err.error;
        }

        await this.alertService.show('Error', errorMessage, 'danger');
      }
    });
  }
}
