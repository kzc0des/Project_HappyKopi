import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchFieldCard } from '../../components/search-field-card/search-field-card';
import { CategoryButtonField } from '../../components/category-button-field/category-button-field';
import { ProductListCard } from '../../components/product-list-card/product-list-card';
import { HeaderService } from '../../../../core/services/header/header.service';
import { Subscription } from 'rxjs';
import { ProductListItemDto } from '../../../../core/dtos/product/product.model';
import { ProductSearchBar } from "../../components/product-search-bar/product-search-bar";

@Component({
  selector: 'app-drink-list-page',
  imports: [CommonModule, SearchFieldCard, CategoryButtonField, ProductListCard, ProductSearchBar],
  templateUrl: './drink-list-page.html',
  styleUrl: './drink-list-page.css'
})
export class DrinkListPage implements OnInit, OnDestroy {
  isDropdownOpen = false;
  private actionSubscription !: Subscription;
  drinks: ProductListItemDto[] = []

  constructor(
    private router: Router,
    private headerService: HeaderService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.drinks = this.route.snapshot.data['productslist'];
    console.log(this.drinks);

    this.actionSubscription = this.headerService.action$.subscribe(action => {
      if (action === 'ADD') {
        this.router.navigate(['create'], { relativeTo: this.route });
      }
    })
  }

  ngOnDestroy(): void {
    if (this.actionSubscription) {
      this.actionSubscription.unsubscribe();
    }
  }

  goToDrink(drinkId: number) {
    this.router.navigate(['drink', drinkId], { relativeTo: this.route });
  }

  goToCategory() {
    this.router.navigate(['/categories-list-page'])
  }

  transformImageUrl(originalUrl: string | null | undefined, width = 64, height = 64): string {
    if (!originalUrl) {
      return 'assets/images/default-kopi.png'; // Isang default na image
    }

    // Hanapin ang '/upload/' sa URL
    const uploadIndex = originalUrl.indexOf('/upload/');
    if (uploadIndex === -1) {
      return originalUrl; // Hindi ito Cloudinary URL
    }

    const baseUrl = originalUrl.substring(0, uploadIndex);
    const versionAndPath = originalUrl.substring(uploadIndex + 8); // +8 para sa '/upload/'

    /*
     * ITO ANG PINAKA-IMPORTANTE:
     * w_64, h_64:  (Width/Height) Sukat na 64x64px
     * c_fill:      (Crop) Punuin ang box, i-crop ang sobra.
     * g_auto:      (Gravity) MAG-SMART CROP. Hanapin ang subject.
     * f_auto:      (Format) Auto-select (WebP, etc.)
     * q_auto:      (Quality) Auto-quality
     */
    const transformations = `/upload/w_${width},h_${height},c_fill,g_auto,f_auto,q_auto/`;

    return baseUrl + transformations + versionAndPath;
  }
}
