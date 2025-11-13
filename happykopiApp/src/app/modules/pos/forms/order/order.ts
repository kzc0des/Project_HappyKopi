// features/order/pages/order/order.ts
import { Component, signal, OnInit } from '@angular/core';
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
export class Order implements OnInit {
  categories = signal<CategoryWithProductCountDto[]>([]);
  selectedCategory = signal<CategoryWithProductCountDto | null>(null);
 
  allDrinks = signal<ProductsWithCategoryDto[]>([]);
 
  drinks = signal<ProductsWithCategoryDto[]>([]);

  unavailableMap = signal<Map<number, UnavailableProductDto>>(new Map());

  allDrinksCategory: CategoryWithProductCountDto = {
    id: -1,
    name: 'All Drinks',
    productCount: 0,
  };

  showModal = signal(false);
  showUnavailableModal = signal(false);
  selectedDrink = signal<addOrderModalDto | undefined>(undefined);
  selectedUnavailableProduct = signal<UnavailableProductModalData | undefined>(undefined);

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadCategories();
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

  selectAllDrinks() {
    this.selectedCategory.set(this.allDrinksCategory);

    this.orderService.getProductsWithAvailability().subscribe({
      next: ({ products, unavailableMap }) => {
        this.allDrinks.set(products); // Store all drinks
        this.drinks.set(products); // Display all drinks initially
        this.unavailableMap.set(unavailableMap);
      },
      error: (err) => console.error(err),
    });
  }

  selectCategory(category: CategoryWithProductCountDto) {
    this.selectedCategory.set(category);

    this.orderService.getProductsWithAvailability(category.id).subscribe({
      next: ({ products, unavailableMap }) => {
        this.allDrinks.set(products); // Store all drinks in category
        this.drinks.set(products); // Display all drinks initially
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
    const unavailableInfo = this.unavailableMap().get(drink.id);

    if (unavailableInfo) {
      this.selectedUnavailableProduct.set({
        productName: drink.name,
        categoryName: drink.categoryName,
        price: drink.price,
        imageUrl: drink.imageUrl || '',
        unavailableInfo: unavailableInfo,
      });
      this.showUnavailableModal.set(true);
    } else {
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
}
