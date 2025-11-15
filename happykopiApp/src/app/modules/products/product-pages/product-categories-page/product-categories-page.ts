import { Component, OnDestroy, OnInit } from '@angular/core';
import { CategoryListCard } from "../../components/category-list-card/category-list-card";
import { CategoryWithProductCountDto } from '../../../../core/dtos/order/category-with-product-count.dto';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../../categories/services/category.service';
import { Subscription } from 'rxjs';

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

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.categories = this.route.snapshot.data['categorylist'];
    this.totalDrinksCount = this.categories.reduce((sum, category) => sum + category.productCount, 0);

    this.subscriptions.add(
      this.categoryService.categoryUpdated$.subscribe(() => {
        this.loadCategories();
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
    });
  }

  onAllDrinksClick() {
    this.router.navigate(['/app/products']);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
