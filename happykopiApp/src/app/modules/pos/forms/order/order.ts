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

  categories = signal<CategoryWithProductCountDto[]>([]);
  selectedCategoryId = signal<number | null>(null);

  drinks = signal<ProductsWithCategoryDto[]>([]);
  filteredDrinks = signal<ProductsWithCategoryDto[]>([]);

  totalProducts = 0;

  unavailableMap = signal<Map<number, UnavailableProductDto>>(new Map());

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
    this.loadData(this.route.snapshot.queryParams['categoryId'] ? +this.route.snapshot.queryParams['categoryId'] : null);
    console.log(this.filteredDrinks());

    this.subscriptions.add(
      this.route.queryParams.subscribe(params => {
        const categoryId = params['categoryId'] ? +params['categoryId'] : null;
        this.loadData(categoryId);
        this.productsService.setSelectedCategoryId(categoryId);
      }));

    this.subscriptions.add(
      this.productsService.productUpdated$.subscribe(() => {
        const categoryId = this.route.snapshot.queryParams['categoryId'];
        this.loadData(categoryId);
      })
    );

    this.subscriptions.add(
      this.categoryService.categoryUpdated$.subscribe(() => {
        const categoryId = this.route.snapshot.queryParams['categoryId'];
        this.loadData(categoryId);
      })
    );

    this.subscriptions.add(
      this.productsService.selectedCategoryId$.subscribe(id => {
        this.selectedCategoryId.set(id);
      })
    );
  }

  loadData(categoryId: number | null) {
    const categories = this.route.snapshot.data['categories'];
    const products: Observable<ProductsWithCategoryDto[]> = this.orderService.getAllProducts(categoryId);

    if (categories) {
      this.categories.set(categories);
    }

    products.subscribe(products => {
      this.drinks.set(products);
      this.filteredDrinks.set(products);
    });

    this.totalProducts = this.categories().reduce((sum, category) => sum + category.productCount, 0);
  }

  onCategoryClick(categoryId: number): void {
    this.router.navigate([], {
      queryParams: { categoryId: categoryId },
      queryParamsHandling: 'merge',
      relativeTo: this.route
    });
    this.productsService.setSelectedCategoryId(categoryId);
  }

  onAllDrinksClick(): void {
    this.router.navigate([], {
      queryParams: { categoryId: null },
      queryParamsHandling: 'merge',
      relativeTo: this.route
    });
    this.productsService.setSelectedCategoryId(null);
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
