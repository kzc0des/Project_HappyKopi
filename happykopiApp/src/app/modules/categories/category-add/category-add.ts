import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../services/category.service';
import { CategoryForCreateUpdateDto } from '../../../core/dtos/category/category-for-create-update-dto';
import { Itemcard } from '../../../shared/components/itemcard/itemcard';
import { FormsModule } from '@angular/forms';
import { HeaderService } from '../../../core/services/header/header.service';
import { Subscription } from 'rxjs';
import { ConfirmationService } from '../../../core/services/confirmation/confirmation.service';
import { Location } from '@angular/common';
import { YellowButton } from "../../../shared/components/yellow-button/yellow-button";
import { LoadingService } from '../../../core/services/loading/loading.service';
import { AlertService } from '../../../core/services/alert/alert.service';

@Component({
  selector: 'app-category-add',
  imports: [Itemcard, FormsModule, YellowButton],
  templateUrl: './category-add.html',
  styleUrl: './category-add.css',
})
export class CategoryAdd implements OnInit {

  categoryDetail !: CategoryForCreateUpdateDto;
  actionSubscription !: Subscription;

  constructor(
    private categoryService: CategoryService,
    private headerService: HeaderService,
    private confirmationService: ConfirmationService,
    private location: Location,
    private loadingService: LoadingService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.categoryDetail = {
      name: ''
    }

    this.actionSubscription = this.headerService.action$.subscribe(async action => {
      if (action === 'SAVE') {
        const confirmation = await this.confirmationService.confirm(
          "Add Category",
          "Make sure that the detail is correct and complete.",
          "primary",
          "Add Category",
          "Cancel"
        )
        if (confirmation) {
          this.saveNewItem();
        }
      }
    })
  }

  async saveNewItem() {
    const confirmation = await this.confirmationService.confirm(
      "Add Category",
      "Make sure that the detail is correct and complete.",
      "primary",
      "Add Category",
      "Cancel"
    )

    if (!confirmation) {
      return;
    }

    if (!this.categoryDetail.name) {
      alert('Please fill out the required field.');
      return;
    }

    this.loadingService.show();
    this.categoryService.createCategory(this.categoryDetail).subscribe({
      next: (response) => {
        this.loadingService.hide();
        this.alertService.showSuccess("Category Added Successfully", "Success");
        this.location.back();
      },
      error: (err) => {
        if (err.status === 409) {
          this.alertService.showError("Category Already Exists", "Error");
        } else {
          this.alertService.showError("Failed to add category", "Error");
        }
        this.loadingService.hide();
      }
    });
  }
}
