import { Component, OnDestroy, OnInit } from '@angular/core';
import { CategoryListCardEdit } from '../../products/components/category-list-card-edit/category-list-card-edit';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryWithProductCountDto } from '../../../core/dtos/category/category-with-product-count-dto';
import { Subscription } from 'rxjs';
import { HeaderService } from '../../../core/services/header/header.service';
import { SignalRService } from '../../../core/services/signalR/signal-r.service';
import { CategoryService } from '../services/category.service';
import { Subject } from '@microsoft/signalr';

@Component({
  selector: 'app-categories-list-page-edit',
  imports: [CategoryListCardEdit],
  templateUrl: './categories-list-page-edit.html',
  styleUrl: './categories-list-page-edit.css'
})
export class CategoriesListPageEdit implements OnInit, OnDestroy {
  categories !: CategoryWithProductCountDto[];
  private subscriptions = new Subscription();
  private actionSubscription !: Subscription;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private headerService: HeaderService,
    private router: Router,
    private signalRService: SignalRService,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.categories = this.route.snapshot.data['categorylist'];
    this.headerService.notifyItemAdded(false);
    console.log(this.categories);

    this.actionSubscription = this.headerService.action$.subscribe(action => {
      if (action === 'ADD') {
        this.router.navigate(['create'], { relativeTo: this.route });
      }
    })
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }
}
