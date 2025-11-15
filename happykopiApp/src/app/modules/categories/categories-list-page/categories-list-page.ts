import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoryListCard } from '../../products/components/category-list-card/category-list-card';
import { CategoryWithProductCountDto } from '../../../core/dtos/category/category-with-product-count-dto';
import { Subscription } from 'rxjs';
import { CategoryService } from '../services/category.service';

@Component({
  selector: 'app-categories-list-page',
  imports: [CommonModule, FormsModule, CategoryListCard],
  templateUrl: './categories-list-page.html',
  styleUrl: './categories-list-page.css',
})
export class CategoriesListPage implements OnInit, OnDestroy {
  categories: CategoryWithProductCountDto[] = [];
  private subscriptions = new Subscription();

  constructor(
    private router: Router,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.subscriptions.add(
      this.categoryService.categoryUpdated$.subscribe(() => {
        this.loadCategories();
      })
    );
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe(data => this.categories = data);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
