import { Component, OnInit } from '@angular/core';
import { CategoryListCard } from "../../components/category-list-card/category-list-card";
import { CategoryWithProductCountDto } from '../../../../core/dtos/order/category-with-product-count.dto';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

export interface CategoryWithProductCountWithIdDto extends CategoryWithProductCountDto {
  id: number;
}

@Component({
  selector: 'app-product-categories-page',
  imports: [CategoryListCard, CommonModule],
  templateUrl: './product-categories-page.html',
  styleUrl: './product-categories-page.css',
})
export class ProductCategoriesPage implements OnInit {
  categories !: CategoryWithProductCountDto[];

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.categories = this.route.snapshot.data['categorylist'];
  }

  onCategoryClick(categoryId: number) {
    this.router.navigate(['/app/products'], {
      queryParams: { categoryId: categoryId },
    });
  }
}
