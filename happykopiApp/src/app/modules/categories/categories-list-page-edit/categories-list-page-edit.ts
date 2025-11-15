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
  showInactive = false;
  private subscriptions = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private headerService: HeaderService,
    private router: Router,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.loadCategories();
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

    this.subscriptions.add(
      this.headerService.toggleArchivedView$.subscribe(() => {
        this.toggleView();
      })
    );

    this.headerService.setArchivedViewStatus(this.showInactive);
  }

  ngOnDestroy(): void {
    this.headerService.setArchivedViewStatus(false); // Reset on leave
    this.subscriptions.unsubscribe();
  }

  loadCategories() {
    const categoriesObservable = this.showInactive
      ? this.categoryService.getInactiveCategories()
      : this.categoryService.getCategories();

    this.subscriptions.add(categoriesObservable.subscribe(data => this.categories = data));
  }

  toggleView(): void {
    this.showInactive = !this.showInactive;
    this.headerService.setArchivedViewStatus(this.showInactive);
    this.headerService.updateTitle(this.showInactive ? 'Archived Categories' : 'Categories');
    this.loadCategories();
  }
}
