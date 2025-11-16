import { Component, OnDestroy, OnInit } from '@angular/core';
import { CategoryListCard } from "../../components/category-list-card/category-list-card";
import { CategoryWithProductCountDto } from '../../../../core/dtos/order/category-with-product-count.dto';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../../categories/services/category.service';
import { Subscription } from 'rxjs';
import { ProductsService } from '../../services/products-service/products.service';

export interface CategoryWithProductCountWithIdDto extends CategoryWithProductCountDto {
  id: number;
}

@Component({
  selector: 'app-product-categories-page',
  imports: [CategoryListCard, CommonModule],
  templateUrl: './product-categories-page.html',
  styleUrl: './product-categories-page.css',
})
export class ProductCategoriesPage implements OnInit, OnDestroy {
  categories !: CategoryWithProductCountDto[];
  totalDrinksCount = 0;
  private subscriptions = new Subscription();

  selectedCategoryId: number | null = null;

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private categoryService: CategoryService,
    private productsService: ProductsService // Inject the service
  ) { }

  ngOnInit(): void {
    this.categories = this.route.snapshot.data['categorylist'];
    this.totalDrinksCount = this.categories.reduce((sum, category) => sum + category.productCount, 0);

    /// <summary>
    /// subscription to the category service to tell the
    /// drink-list page that there's an update
    /// happened
    /// </summary>
    this.subscriptions.add(
      this.categoryService.categoryUpdated$.subscribe(() => {
        this.loadCategories();
      })
    );

    /// <summary>
    /// This will be the one that gets the notification if ever
    /// the selectedCategoryIdSource is updated
    /// </summary>
    this.subscriptions.add(
      this.productsService.selectedCategoryId$.subscribe(id => {
        this.selectedCategoryId = id;
      })
    );
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe(categories => {
      this.categories = categories;
      this.totalDrinksCount = this.categories.reduce((sum, category) => sum + category.productCount, 0);
    });
  }

  onCategoryClick(categoryId: number) {
    /// <summary>
    /// The queryParams are the ones in the address bar that has '?'
    /// its purpose is for filtering
    /// </summary>
    this.router.navigate(['/app/products'], {
      queryParams: { categoryId: categoryId },
      queryParamsHandling: 'merge'
    });
    this.productsService.setSelectedCategoryId(categoryId);
  }

  onAllDrinksClick() {
    this.router.navigate(['/app/products'], {
      queryParams: { categoryId: null } 
    });
    this.productsService.setSelectedCategoryId(null);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
