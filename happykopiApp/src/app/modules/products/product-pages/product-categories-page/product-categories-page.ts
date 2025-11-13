import { Component, OnInit } from '@angular/core';
import { CategoryListCard } from "../../components/category-list-card/category-list-card";
import { CategoryWithProductCountDto } from '../../../../core/dtos/order/category-with-product-count.dto';
import { ActivatedRoute } from '@angular/router';

export interface CategoryWithProductCountWithIdDto extends CategoryWithProductCountDto {
  id: number;
}

@Component({
  selector: 'app-product-categories-page',
  imports: [CategoryListCard],
  templateUrl: './product-categories-page.html',
  styleUrl: './product-categories-page.css',
})
export class ProductCategoriesPage implements OnInit {
  categories !: CategoryWithProductCountDto[];

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.categories = this.route.snapshot.data['categorylist'];
  }
}
