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

    this.subscriptions.add(
      this.categoryService.categoryUpdated$.subscribe(() => {
        this.loadCategories();
      })
    );

    this.subscriptions.add(
      this.route.queryParams.subscribe(params => {
        // I-update lang ang service kung may specific na categoryId sa URL.
        // Kung walang categoryId, huwag i-override ang existing state sa service.
        if (params['categoryId'] !== undefined) {
          this.productsService.setSelectedCategoryId(+params['categoryId'] || null);
        }
      })
    );

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
    this.router.navigate(['/app/products'], {
      queryParams: { categoryId: categoryId },
      queryParamsHandling: 'merge'
    });
    this.productsService.setSelectedCategoryId(categoryId); // Update the service state
  }

  onAllDrinksClick() {
    this.router.navigate(['/app/products'], {
      queryParams: { categoryId: null } 
    });
    this.productsService.setSelectedCategoryId(null); // Update the service state
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
