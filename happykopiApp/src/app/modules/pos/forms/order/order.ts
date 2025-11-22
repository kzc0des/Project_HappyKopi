// features/order/pages/order/order.ts
import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { CategoryWithProductCountDto } from '../../../../core/dtos/order/category-with-product-count.dto';
import { PosCategoryOff } from '../../components/pos-category-off/pos-category-off';
import { OrderCard } from '../../components/order-card/order-card';
import { SearchDrink } from '../../../../shared/components/search-drink/search-drink';
import { OrderQuickView } from '../../components/order-quick-view/order-quick-view';
import { ProductsWithCategoryDto } from '../../../../core/dtos/order/products-with-category.dto';
import { AddOrderModal, addOrderModalDto } from '../../modal/add-order-modal/add-order-modal';
import { UnavailableProductDto } from '../../../../core/dtos/order/product-availability.dto';
import {
  UnavailableProductModal,
  UnavailableProductModalData,
} from '../../modal/unavailable-modal/unavailable-modal';
import { ProductConfigurationResultDto } from '../../../../core/dtos/order/product-configuration-result.dto';
import { OrderItem } from '../../../../core/dtos/order/order-item.dto';
import { ProductsService } from '../../../products/services/products-service/products.service';
import { CategoryService } from '../../../categories/services/category.service';
import { filter, Observable, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryCard } from '../../components/category-card/category-card';

@Component({
  selector: 'app-order',
  imports: [
    CategoryCard,
    OrderCard,
    SearchDrink,
    OrderQuickView,
    AddOrderModal,
    UnavailableProductModal,
  ],
  templateUrl: './order.html',
  styleUrls: ['./order.css'],
})
export class Order implements OnInit, OnDestroy {
  private subscriptions = new Subscription();

  // for category
  categories = signal<CategoryWithProductCountDto[]>([]);
  selectedCategoryId = signal<number | null>(null);

  // for searching
  drinks = signal<ProductsWithCategoryDto[]>([]);
  filteredDrinks = signal<ProductsWithCategoryDto[]>([]);

  // new var
  totalProducts = 0;

  // for add order modal


  // for unavailable drinks
  unavailableMap = signal<Map<number, UnavailableProductDto>>(new Map());

  // for default na allDrinks
  // allDrinksCategory: CategoryWithProductCountDto = {
  //   id: -1,
  //   name: 'All Drinks',
  //   productCount: 0,
  // };

  showModal = signal(false);
  showUnavailableModal = signal(false);
  selectedDrink = signal<addOrderModalDto | undefined>(undefined);
  selectedUnavailableProduct = signal<UnavailableProductModalData | undefined>(undefined);

  constructor(
    private orderService: OrderService,
    private productsService: ProductsService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadData();
    this.totalProducts = this.categories()
      .reduce((sum, category) => sum + category.productCount, 0);

    console.log(this.filteredDrinks());
    
    this.subscriptions.add(
      this.productsService.productUpdated$.subscribe(() => {
        console.log('Product update received in POS. Reloading categories and products.');
        this.loadData();
      })
    );

    this.subscriptions.add(
      this.categoryService.categoryUpdated$.subscribe(() => {
        console.log('Category update received in POS. Reloading categories.');
        this.loadData();
      })
    );

    this.subscriptions.add(
      this.productsService.selectedCategoryId$.subscribe(id => {
        this.selectedCategoryId.set(id);
      })
    )
  }

  loadData() {
    const categories = this.route.snapshot.data['categories'];
    const products = this.route.snapshot.data['products'];

    if (categories) {
      this.categories.set(categories);
    }

    if (products) {
      this.filteredDrinks.set(products);
      this.drinks.set(products);
    }
  }

  onCategoryClick(categoryId: number): void {
    this.router.navigate(['/app/products'], {
      queryParams: { categoryId: categoryId },
      queryParamsHandling: 'merge'
    });
    this.productsService.setSelectedCategoryId(categoryId);
  }

  onSearchResults(filteredDrinks: ProductsWithCategoryDto[]) {
    this.drinks.set(filteredDrinks);
  }

  closeModal() {
    this.showModal.set(false);
  }

  onCloseModal() {
    this.showModal.set(false);
  }

  onCloseUnavailableModal() {
    this.showUnavailableModal.set(false);
  }

  isProductAvailable(drinkId: number): boolean {
    return !this.unavailableMap().has(drinkId);
  }

  getUniqueDrinks(): ProductsWithCategoryDto[] {
    const seen = new Set<number>();
    return this.drinks().filter((drink) => {
      if (seen.has(drink.id)) {
        return false;
      }
      seen.add(drink.id);
      return true;
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
