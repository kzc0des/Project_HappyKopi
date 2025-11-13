import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryWithProductCountDto } from '../../../core/dtos/category/category-with-product-count-dto';
import { Itemcard } from "../../../shared/components/itemcard/itemcard";
import { YellowButton } from "../../../shared/components/yellow-button/yellow-button";
import { HeaderService } from '../../../core/services/header/header.service';
import { Subscription } from 'rxjs';
import { CategoryService } from '../services/category.service';
import { ConfirmationService } from '../../../core/services/confirmation/confirmation.service';
import { CategoryForCreateUpdateDto } from '../../../core/dtos/category/category-for-create-update-dto';


@Component({
  selector: 'app-edit-category-page',
  imports: [CommonModule, FormsModule, Itemcard, YellowButton],
  templateUrl: './edit-category-page.html',
  styleUrl: './edit-category-page.css'
})
export class EditCategoryPage implements OnInit {
  category !: CategoryWithProductCountDto;
  categoryUpdate !: CategoryForCreateUpdateDto;
  revertVersion !: string;
  private actionSubscription !: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private headerService: HeaderService,
    private categoryService: CategoryService,
    private confirmationService: ConfirmationService
  ) { }

  goToCreateDrink() {
    this.router.navigate(['/create-drink-page'], {
      state: { category: this.category }
    });
  }

  goToAssignDrink() {
    this.router.navigate(['assign'], {
      relativeTo: this.route
    });
  }

  ngOnInit() {
    this.category = this.route.snapshot.data['categoryDetail'];
    this.revertVersion = this.category.name;
    console.log(`Revert Version: ${this.revertVersion}`);
    
    // **CRITICAL FIX**: I-reset ang action bago mag-subscribe.
    // Tinitiyak nito na hindi mapoproseso ang 'SAVE' action mula sa `assign-drink-page`.
    this.headerService.resetAction();

    this.actionSubscription = this.headerService.action$.subscribe(async action => {
      if (action === 'DELETE') {
        const confirmedDelete = await this.confirmationService.confirm(
          'Delete Category?',
          'Make sure that there are no longer drinks linked to this category.',
          'danger',
          'Delete',
          'Cancel',
        )
        if (confirmedDelete) {
          this.deleteCategory();
        }
      }
      else if (action === 'SAVE') {
        const confirmedSave = await this.confirmationService.confirm(
          'Confirm Save?',
          `Are you sure you want to save these changes?`,
          'primary',
          'Add Item'
        );
        if(confirmedSave){
          this.updateCategory();
        }
      }
      else if (action === 'BACK') {
        this.router.navigate(['/app/category'], { relativeTo: this.route, replaceUrl: true });
      }
    })

  }

  deleteCategory() {
    this.categoryService.deleteCategory(this.category.id).subscribe({
      next: response => {
        console.log(`Delete successful. ${response}`);
        this.headerService.notifyItemDeleted(true);
        this.router.navigate(['../'], { relativeTo: this.route, replaceUrl: true })
      },
      error: err => {
        console.error(`Delete failed ${err}`);
      }
    })
  }

  updateCategory() {
    this.categoryUpdate = {
      name: this.category.name
    }

    this.categoryService.updateCategory(this.category.id, this.categoryUpdate).subscribe({
      next: response => {
        console.log(`Update successful. ${response}`);
      },
      error: err => {
        console.error('Update failed');
        this.category.name = this.revertVersion;
      }
  })
  }
}
