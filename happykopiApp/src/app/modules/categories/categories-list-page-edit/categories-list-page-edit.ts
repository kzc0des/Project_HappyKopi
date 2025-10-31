import { Component, OnInit } from '@angular/core';
import { CategoryListCardEdit } from '../../products/components/category-list-card-edit/category-list-card-edit';
import { ActivatedRoute } from '@angular/router';
import { CategoryWithProductCountDto } from '../../../core/dtos/category/category-with-product-count-dto';

@Component({
  selector: 'app-categories-list-page-edit',
  imports: [CategoryListCardEdit],
  templateUrl: './categories-list-page-edit.html',
  styleUrl: './categories-list-page-edit.css'
})
export class CategoriesListPageEdit implements OnInit {
  categories !: CategoryWithProductCountDto[];

  constructor (
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.categories = this.route.snapshot.data['categorylist'];
    console.log(this.categories);
  }
}
