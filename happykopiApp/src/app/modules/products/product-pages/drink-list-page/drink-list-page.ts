import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchFieldCard } from '../../components/search-field-card/search-field-card';
import { CategoryButtonField } from '../../components/category-button-field/category-button-field';
import { ProductListCard } from '../../components/product-list-card/product-list-card';
import { HeaderService } from '../../../../core/services/header/header.service';
import { Subscription } from 'rxjs';
import { ProductListItemDto } from '../../../../core/dtos/product/product.model';

@Component({
  selector: 'app-drink-list-page',
  imports: [CommonModule, SearchFieldCard, CategoryButtonField, ProductListCard],
  templateUrl: './drink-list-page.html',
  styleUrl: './drink-list-page.css'
})
export class DrinkListPage implements OnInit {
  isDropdownOpen = false;
  private actionSubscription !: Subscription;
  drinks: ProductListItemDto[] = []

  constructor(
    private router: Router,
    private headerService: HeaderService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.drinks = this.route.snapshot.data['productslist'];
    console.log(this.drinks);

    this.actionSubscription = this.headerService.action$.subscribe(action => {
      if(action === 'ADD'){
        this.router.navigate(['create'], {relativeTo: this.route});
      }
    })
  }

  goToDrink(drink: any) {
    this.router.navigate(['/drink-detail', drink.name], { state: { drink } });
  }

  goToCategory() {
    this.router.navigate(['/categories-list-page'])
  }
}
