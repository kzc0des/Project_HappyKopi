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
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-order',
  imports: [
    PosCategoryOff,
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
  selectedCategory = signal<CategoryWithProductCountDto | null>(null);

  // for searching
  allDrinks = signal<ProductsWithCategoryDto[]>([]);
  drinks = signal<ProductsWithCategoryDto[]>([]);

  // for unavailable drinks
  unavailableMap = signal<Map<number, UnavailableProductDto>>(new Map());

  // for default na allDrinks
  allDrinksCategory: CategoryWithProductCountDto = {
    id: -1,
    name: 'All Drinks',
    productCount: 0,
  };

  showModal = signal(false);
  showUnavailableModal = signal(false);
  selectedDrink = signal<addOrderModalDto | undefined>(undefined);
  selectedUnavailableProduct = signal<UnavailableProductModalData | undefined>(undefined);

  constructor(
    private orderService: OrderService,
    private productsService: ProductsService
  ) {}

  ngOnInit(): void {
    this.loadCategories();

    // Listen for real-time product updates
    this.subscriptions.add(
      this.productsService.productUpdated$.subscribe(() => {
        console.log('Product update received in POS. Reloading categories and products.');
        this.loadCategories();
      })
    );
  }

  loadCategories() {
    this.orderService.getCategories().subscribe({
      next: (data) => {
        this.categories.set(data);
        const totalProducts = data.reduce((sum, category) => sum + category.productCount, 0);
        this.allDrinksCategory.productCount = totalProducts;
        this.selectAllDrinks();
      },
      error: (err) => console.error(err),
    });
  }
  allProductConfigs: Map<number, ProductConfigurationResultDto> = new Map();

  selectAllDrinks() {
    this.selectedCategory.set(this.allDrinksCategory);

    this.orderService.getProductsWithAvailability().subscribe({
      next: async ({ products, unavailableMap }) => {
        this.allDrinks.set(products);
        this.drinks.set(products);
        this.unavailableMap.set(unavailableMap);

        // Preload all product configs
        for (const drink of products) {
          this.orderService.getProductConfiguration(drink.id).subscribe({
            next: (config) => this.allProductConfigs.set(drink.id, config),
            error: (err) => console.error(err),
          });
        }
      },
      error: (err) => console.error(err),
    });
  }

  isProductEffectivelyAvailable(drinkId: number): boolean {
    const productConfig = this.allProductConfigs.get(drinkId);
    if (!productConfig) return false;

    const existingOrders: OrderItem[] = JSON.parse(localStorage.getItem('orders') || '[]');
    const usedIngredients = new Map<number, number>();

    existingOrders.forEach((order) => {
      if (order.drinkID === undefined) return;
      const config = this.allProductConfigs.get(order.drinkID);
      if (!config) return;

      // Get ingredients for this order's variant (includes both base + modifier ingredients)
      const orderIngredients = config.ingredients.filter(
        (ing) => ing.productVariantId === order.productVariantId
      );

      orderIngredients.forEach((ing) => {
        const totalUsed = ing.quantityNeeded * order.quantity;
        const current = usedIngredients.get(ing.stockItemId) || 0;
        usedIngredients.set(ing.stockItemId, current + totalUsed);
      });
    });

    // Check ALL ingredients for the product (base + modifier for each variant)
    const allVariantIngredients = productConfig.ingredients;

    // Group by variant and check if at least one variant is available
    const variantIds = [...new Set(allVariantIngredients.map((ing) => ing.productVariantId))];

    for (const variantId of variantIds) {
      const variantIngredients = allVariantIngredients.filter(
        (ing) => ing.productVariantId === variantId
      );

      let variantAvailable = true;
      for (const ing of variantIngredients) {
        const alreadyUsed = usedIngredients.get(ing.stockItemId) || 0;
        const remainingStock = ing.availableStock - alreadyUsed;

        if (remainingStock < ing.quantityNeeded) {
          variantAvailable = false;
          break;
        }
      }

      // If at least one variant is available, product is available
      if (variantAvailable) return true;
    }

    return false;
  }

  selectCategory(category: CategoryWithProductCountDto) {
    this.selectedCategory.set(category);

    this.orderService.getProductsWithAvailability(category.id).subscribe({
      next: ({ products, unavailableMap }) => {
        this.allDrinks.set(products);
        this.drinks.set(products);
        this.unavailableMap.set(unavailableMap);
      },
      error: (err) => console.error(err),
    });
  }

  onAllDrinksClick() {
    this.selectAllDrinks();
  }

  onCategoryClick(category: CategoryWithProductCountDto) {
    this.selectCategory(category);
  }

  onSearchResults(filteredDrinks: ProductsWithCategoryDto[]) {
    this.drinks.set(filteredDrinks);
  }

  closeModal() {
    this.showModal.set(false);
  }

  onDrinkClicked(drink: ProductsWithCategoryDto): void {
    const effectivelyAvailable = this.isProductEffectivelyAvailable(drink.id);

    if (!effectivelyAvailable) {
      // ALL variants are out of stock - show unavailable modal
      const unavailableInfo = this.unavailableMap().get(drink.id);
      this.selectedUnavailableProduct.set({
        productName: drink.name,
        categoryName: drink.categoryName,
        price: drink.price,
        imageUrl: drink.imageUrl || '',
        unavailableInfo:
          unavailableInfo ??
          ({
            productId: drink.id,
            productName: drink.name,
            categoryName: drink.categoryName,
            price: drink.price,
            imageUrl: drink.imageUrl || '',
            reason: 'Insufficient stock to add this drink based on current basket.',
          } as UnavailableProductDto),
      });
      this.showUnavailableModal.set(true);
    } else {
      // AT LEAST ONE variant is available - show add order modal
      this.selectedDrink.set({
        ProductId: drink.id,
        DrinkName: drink.name,
        DrinkCategory: drink.categoryName,
        BasePrice: drink.price,
        ImageUrl: drink.imageUrl || '',
      });
      this.showModal.set(true);
    }
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
