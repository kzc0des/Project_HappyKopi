import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../services/category.service';
import { CategoryForCreateUpdateDto } from '../../../core/dtos/category/category-for-create-update-dto';
import { Itemcard } from '../../../shared/components/itemcard/itemcard';
import { FormsModule } from '@angular/forms';
import { HeaderService } from '../../../core/services/header/header.service';
import { Subscription } from 'rxjs';
import { ConfirmationService } from '../../../core/services/confirmation/confirmation.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-category-add',
  imports: [Itemcard, FormsModule],
  templateUrl: './category-add.html',
  styleUrl: './category-add.css',
})
export class CategoryAdd implements OnInit{

  categoryDetail !: CategoryForCreateUpdateDto;
  actionSubscription !: Subscription;

  constructor (
    private categoryService: CategoryService,
    private headerService: HeaderService,
    private confirmationService: ConfirmationService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.categoryDetail = {
      name: ''
    }

    this.actionSubscription = this.headerService.action$.subscribe(async action => {
      if(action === 'SAVE'){
        const confirmation = await this.confirmationService.confirm(
          "Add Category",
          "Make sure that the detail is correct and complete.",
          "primary",
          "Add Category",
          "Cancel"
        )
        if(confirmation){
          this.saveNewItem();
        }
      }
    })
  }

  private saveNewItem(): void {
    if (!this.categoryDetail.name) {
      alert('Please fill out the required field.');
      return;
    }


    this.categoryService.createCategory(this.categoryDetail).subscribe({
      next: (response) => {
        console.log('Item created successfully!', response);
        this.location.back();
      },
      error: (err) => {
        if (err.status === 409) {
          alert(`Error: ${err.error.message}`);
        } else {
          alert('An unexpected error occurred. Please try again.');
        }
        console.error('Failed to create item:', err);
      }
    });
  }
}
