import { Component, OnDestroy, OnInit } from '@angular/core';
import { CategoryListCardEdit } from '../../products/components/category-list-card-edit/category-list-card-edit';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryWithProductCountDto } from '../../../core/dtos/category/category-with-product-count-dto';
import { Subscription } from 'rxjs';
import { HeaderService } from '../../../core/services/header/header.service';
import { CategoryService } from '../services/category.service';

@Component({
  selector: 'app-categories-list-page-edit',
  imports: [CategoryListCardEdit],
  templateUrl: './categories-list-page-edit.html',
  styleUrl: './categories-list-page-edit.css'
})
export class CategoriesListPageEdit implements OnInit, OnDestroy {
  categories !: CategoryWithProductCountDto[];
  private subscriptions = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private headerService: HeaderService,
    private router: Router,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.loadCategoriesFromResolver();
    this.headerService.notifyItemAdded(false);

    this.subscriptions.add(
      this.headerService.action$.subscribe(action => {
        if (action === 'ADD') {
          this.router.navigate(['create'], { relativeTo: this.route });
        }
      })
    );

    this.subscriptions.add(
      this.categoryService.categoryUpdated$.subscribe(() => {
        this.loadCategories();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }

  private loadCategoriesFromResolver(): void {
    this.categories = this.route.snapshot.data['categorylist'];
    console.log('Categories loaded from resolver:', this.categories);
  }
}
