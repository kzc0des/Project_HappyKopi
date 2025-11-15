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
    this.router.navigate(['create'], {
      state: { category: this.category },
      relativeTo: this.route
    });
  }

  goToAssignDrink() {
    this.router.navigate(['assign'], {
      relativeTo: this.route
    });
  }

  ngOnInit() {
    this.category = this.route.snapshot.data['categoryDetail'];
    console.log(this.category);
    this.revertVersion = this.category.name;
    console.log(`Revert Version: ${this.revertVersion}`);
    
    this.headerService.resetAction();

    if (!this.category.isActive) {
      this.headerService.emitAction('SHOW_RESTORE');
      console.log(`Show Restore Button: ${this.category.isActive}`);
    }

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
      else if (action === 'RESTORE') {
        const confirmedRestore = await this.confirmationService.confirm(
          'Restore Category?',
          `This will make the category active again.`,
          'primary',
          'Restore',
          'Cancel',
        );
        if (confirmedRestore) {
          this.restoreCategory();
        }
      }
    })

  }

  ngOnDestroy(): void {
    if (this.actionSubscription) {
      this.actionSubscription.unsubscribe();
    }
    this.headerService.emitAction('HIDE_RESTORE'); // Itago ang restore button pag-alis sa page
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

  restoreCategory() {
    this.categoryService.restoreCategory(this.category.id).subscribe({
      next: () => {
        console.log(`Restore successful.`);
        // Mag-navigate pabalik sa edit list, kung saan makikita na ang restored item sa active list.
        this.router.navigate(['/app/category']);
      },
      error: err => {
        console.error(`Restore failed ${err}`);
      }
    });
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
