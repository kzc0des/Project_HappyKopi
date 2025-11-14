import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductWithCategoryNameDto } from '../../../core/dtos/category/product-with-category-name-dto';
import { ProductSearchBar } from '../../products/components/product-search-bar/product-search-bar';
import { HeaderService } from '../../../core/services/header/header.service';
import { Subscription } from 'rxjs';
import { CategoryService } from '../services/category.service';
import { LoadingService } from '../../../core/services/loading/loading.service';
import { ConfirmationService } from '../../../core/services/confirmation/confirmation.service';

@Component({
  selector: 'app-assign-drink-page',
  imports: [CommonModule, ProductSearchBar],
  templateUrl: './assign-drink-page.html',
  styleUrl: './assign-drink-page.css'
})
export class AssignDrinkPage implements OnInit, OnDestroy {
  drinks: ProductWithCategoryNameDto[] = [];
  selectedDrinks: ProductWithCategoryNameDto[] = [];
  filteredDrinks: ProductWithCategoryNameDto[] = [];
  private categoryId!: number;
  private actionSubscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private headerService: HeaderService,
    private categoryService: CategoryService,
    private loadingService: LoadingService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    const datalist: ProductWithCategoryNameDto[] | null = this.route.snapshot.data['products'];
    if (datalist) {
      this.drinks = datalist;
      this.filteredDrinks = datalist;
    }
    console.log(this.drinks);

    this.categoryId = Number(this.route.snapshot.paramMap.get('categoryId'));

    this.actionSubscription = this.headerService.action$.subscribe(async action => {
      if (action === 'SAVE') {
        const confirmedSave = await this.confirmationService.confirm(
          'Confirm Save?',
          `Are you sure you want to save these changes?`,
          'primary',
          'Add Item'
        );
        if (confirmedSave) {
          this.saveAssignedDrinks();
        }
      } else if (action === 'BACK') {

      }
    });
  }

  ngOnDestroy(): void {
    if (this.actionSubscription) {
      this.actionSubscription.unsubscribe();
      this.headerService.notifyValueChanged('drinkAssignment', false);
    }
  }

  onSearch(searchTerm: string): void {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    this.filteredDrinks = this.drinks.filter(drink =>
      drink.name.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }

  toggleSelection(drink: ProductWithCategoryNameDto) {
    const index = this.selectedDrinks.findIndex(d => d.id === drink.id);

    if (index === -1) {
      this.selectedDrinks.push(drink);
    } else {
      this.selectedDrinks.splice(index, 1);
    }
    console.log('Selected Drinks:', this.selectedDrinks);
    this.headerService.notifyValueChanged('drinkAssignment', this.selectedDrinks.length > 0);
  }

  onSelectionChange(selected: any[]) {
    this.selectedDrinks = selected;
    console.log('Selected:', selected);
  }

  isSelected(drink: ProductWithCategoryNameDto): boolean {
    return this.selectedDrinks.some(d => d.id === drink.id);
  }

  saveAssignedDrinks(): void {
    if (this.selectedDrinks.length === 0) {
      console.log('No drinks selected to assign.');
      return;
    }

    this.loadingService.show();
    const productIds = this.selectedDrinks.map(drink => drink.id);

    this.categoryService.assignProductsToCategory(this.categoryId, productIds).subscribe({
      next: () => {
        this.loadingService.hide();
        this.headerService.notifyItemAdded(true);
        this.headerService.resetAction();
        this.router.navigate(['../'], { relativeTo: this.route, replaceUrl: true });
      },
      error: () => this.loadingService.hide()
    });
  }
}
