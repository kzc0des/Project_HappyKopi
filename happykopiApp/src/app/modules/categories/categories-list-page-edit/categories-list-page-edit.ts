import { Component, OnInit } from '@angular/core';
import { CategoryListCardEdit } from '../../products/components/category-list-card-edit/category-list-card-edit';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryWithProductCountDto } from '../../../core/dtos/category/category-with-product-count-dto';
import { Subscription } from 'rxjs';
import { HeaderService } from '../../../core/services/header/header.service';

@Component({
  selector: 'app-categories-list-page-edit',
  imports: [CategoryListCardEdit],
  templateUrl: './categories-list-page-edit.html',
  styleUrl: './categories-list-page-edit.css'
})
export class CategoriesListPageEdit implements OnInit {
  categories !: CategoryWithProductCountDto[];
  private actionSubscription !: Subscription;

  constructor(
    private route: ActivatedRoute,
    private headerService: HeaderService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.categories = this.route.snapshot.data['categorylist'];
    console.log(this.categories);

    this.actionSubscription = this.headerService.action$.subscribe(action => {
      if (action === 'ADD') {
        this.router.navigate(['create'], {relativeTo: this.route});
      }
    })
  }
}
