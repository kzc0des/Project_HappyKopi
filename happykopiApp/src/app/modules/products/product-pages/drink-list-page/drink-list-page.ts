import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryButtonField } from '../../components/category-button-field/category-button-field';
import { ProductListCard } from '../../components/product-list-card/product-list-card';
import { HeaderService } from '../../../../core/services/header/header.service';
import { Observable, Subscription } from 'rxjs';
import { ProductListItemDto } from '../../../../core/dtos/product/product.model';
import { ProductSearchBar } from "../../components/product-search-bar/product-search-bar";
import { ProductsService } from '../../services/products-service/products.service';

@Component({
  selector: 'app-drink-list-page',
  imports: [
    CommonModule, 
    CategoryButtonField, 
    ProductListCard, 
    ProductSearchBar
  ],
  templateUrl: './drink-list-page.html',
  styleUrl: './drink-list-page.css'
})
export class DrinkListPage implements OnInit, OnDestroy {
  isDropdownOpen = false;
  private actionSubscription !: Subscription;

  private subscriptions: Subscription = new Subscription();
  drinks: ProductListItemDto[] = [];
  filteredDrinks: ProductListItemDto[] = [];
  allDrinks: ProductListItemDto[] = [];
  showInactive = false;
  currentCategoryName: string = 'All Drinks';

  constructor(
    private router: Router,
    private headerService: HeaderService,
    private route: ActivatedRoute,
    private productService: ProductsService
  ) { }

  ngOnInit(): void {
    this.headerService.setArchivedViewStatus(this.showInactive);
    this.headerService.notifyItemAdded(false);

    /// <summary>
    /// subscription to the product service to tell the
    /// drink-list page that there's an update
    /// happened
    /// </summary>
    this.subscriptions.add(
      this.productService.productUpdated$.subscribe(() => {
        const categoryId = this.route.snapshot.queryParams['categoryId'];
        this.loadProducts(categoryId);
      })
    );

    /// <summary>
    /// subscription to the routes to check if there are any
    /// query parameters in the url and if it has
    /// the loadproducts function will do the filtering
    /// </summary>
    this.subscriptions.add(
      this.route.queryParams.subscribe(params => {
        const categoryId = params['categoryId'] !== undefined ? +params['categoryId'] || null : null;
        this.productService.setSelectedCategoryId(categoryId);
        this.loadProducts(categoryId);
      })
    );

    this.subscriptions.add(
      this.headerService.action$.subscribe(action => {
        if (action === 'ADD') {
          this.router.navigate(['create'], { relativeTo: this.route });
        }
      })
    );

    this.subscriptions.add(
      this.headerService.toggleArchivedView$.subscribe(() => {
        this.toggleView();
      })
    );
  }

  loadProducts(categoryId: number | null): void {
    /// <summary>
    /// This will serve as the actual stream of data
    /// that is being fetched from the database
    /// therefore it fetches observable data
    /// </summary>
    const productsObservable : Observable<ProductListItemDto[]> = this.showInactive
      ? this.productService.getInactiveProducts(categoryId)
      : this.productService.getActiveProducts(categoryId);

    /// <summary>
    /// The 'products' in this arrow function are the data
    /// that is being fetched from the stream, and by using subscribe
    /// you are accessing that stream
    /// </summary>
    productsObservable.subscribe(products => {
      this.drinks = products;
      this.filteredDrinks = products;
      if (categoryId && products.length > 0) {
        this.currentCategoryName = products[0].categoryName;
      } else {
        this.currentCategoryName = 'All Drinks';
      }
    });
  }

  toggleView(): void {
    this.showInactive = !this.showInactive;
    this.headerService.setArchivedViewStatus(this.showInactive);
    this.headerService.updateTitle(this.showInactive ? 'Archived Products' : 'Products');
    const categoryId = this.route.snapshot.queryParams['categoryId'];
    this.loadProducts(categoryId);
  }

  onSearch(searchTerm: string): void {
    this.filteredDrinks = this.drinks
      .filter(drink =>
        drink.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }

  ngOnDestroy(): void {
    this.headerService.setArchivedViewStatus(false);
    this.subscriptions.unsubscribe();
  }

  /**
   * @param drinkId 
   * @description navigate to drink-detail-page
   */
  goToDrink(drinkId: number) {
    this.router.navigate(['drink', drinkId], { 
      relativeTo: this.route 
    });
  }

  /**
   * @param originalUrl 
   * @param width 
   * @param height 
   * @returns returns cropped and optimized img before uploading in cloud
   */
  transformImageUrl(originalUrl: string | null | undefined, width = 64, height = 64): string {
    if (!originalUrl) {
      return 'assets/images/default-kopi.png'; 
    }

    const uploadIndex = originalUrl.indexOf('/upload/');
    if (uploadIndex === -1) {
      return originalUrl;
    }

    const baseUrl = originalUrl.substring(0, uploadIndex);
    const versionAndPath = originalUrl.substring(uploadIndex + 8);

    /** 
     * @param w_64, h_64:  (Width/Height) 
     * @param c_fill:      (Crop) 
     * @param g_auto:      (Gravity) SMART CROP. 
     * @param f_auto:      (Format) Auto-select (WebP, etc.)
     * @param q_auto:      (Quality) Auto-quality
     */
    const transformations = `/upload/w_${width},h_${height},c_fill,g_auto,f_auto,q_auto/`;

    return baseUrl + transformations + versionAndPath;
  }
}
