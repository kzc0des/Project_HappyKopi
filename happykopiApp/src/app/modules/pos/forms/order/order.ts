import { Component, signal, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { CategoryWithProductCountDto } from '../../../../core/dtos/order/category-with-product-count.dto';
import { PosCategoryOff } from '../../components/pos-category-off/pos-category-off';
import { OrderCard } from '../../components/order-card/order-card';
import { SearchDrink } from '../../../../shared/components/search-drink/search-drink';
import { OrderQuickView } from '../../components/order-quick-view/order-quick-view';
import { ActivatedRoute } from '@angular/router';
import { ProductsWithCategoryDto } from '../../../../core/dtos/order/products-with-category.dto';
import { AddOrderModal, addOrderModalDto } from '../../modal/add-order-modal/add-order-modal';
import { ProductConfigurationResultDto } from '../../../../core/dtos/order/product-configuration-result.dto';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-order',
  imports: [PosCategoryOff, OrderCard, SearchDrink, OrderQuickView, AddOrderModal],
  templateUrl: './order.html',
  styleUrls: ['./order.css'],
})
export class Order implements OnInit {
  categories = signal<CategoryWithProductCountDto[]>([]);
  selectedCategory = signal<CategoryWithProductCountDto | null>(null);
  drinks = signal<ProductsWithCategoryDto[]>([]);

  // Add All Drinks category
  allDrinksCategory: CategoryWithProductCountDto = {
    id: -1,
    name: 'All Drinks',
    productCount: 0,
  };

  showModal = signal(false);
  selectedDrink = signal<addOrderModalDto | undefined>(undefined);

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.orderService.getCategories().subscribe({
      next: (data) => {
        this.categories.set(data);

        // Calculate total product count for All Drinks
        const totalProducts = data.reduce((sum, category) => sum + category.productCount, 0);
        this.allDrinksCategory.productCount = totalProducts;

        // Set All Drinks as default selected
        this.selectAllDrinks();
      },
      error: (err) => console.error(err),
    });
  }

  // Alternative approach in the component if no backend endpoint
  selectAllDrinks() {
    this.selectedCategory.set(this.allDrinksCategory);

    // If no backend endpoint, combine products from all categories
    const allDrinks: ProductsWithCategoryDto[] = [];

    // Fetch products from each category and combine
    const categoryRequests = this.categories().map((category) =>
      this.orderService.getProductsByCategory(category.id)
    );

    forkJoin(categoryRequests).subscribe({
      next: (results) => {
        results.forEach((drinks) => allDrinks.push(...drinks));
        this.drinks.set(allDrinks);
      },
      error: (err) => console.error(err),
    });
  }

  selectCategory(category: CategoryWithProductCountDto) {
    this.selectedCategory.set(category);
    this.orderService.getProductsByCategory(category.id).subscribe({
      next: (drinks) => this.drinks.set(drinks),
      error: (err) => console.error(err),
    });
  }

  onAllDrinksClick() {
    this.selectAllDrinks();
  }

  onCategoryClick(category: CategoryWithProductCountDto) {
    this.selectCategory(category);
  }

  openDrinkModal(drink: ProductsWithCategoryDto) {}

  closeModal() {
    this.showModal.set(false);
  }

  onDrinkClicked(drink: ProductsWithCategoryDto): void {
    this.selectedDrink.set({
      ProductId: drink.id,
      DrinkName: drink.name,
      DrinkCategory: drink.categoryName,
      BasePrice: drink.price,
      ImageUrl: drink.imageUrl || '',
    });
    this.showModal.set(true);
  }

  onCloseModal() {
    this.showModal.set(false);
  }
}
