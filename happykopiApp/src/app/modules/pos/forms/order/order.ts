import { Component, signal, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { CategoryWithProductCountDto } from '../../../../core/dtos/order/category-with-product-count.dto';
import { PosCategoryOff } from '../../components/pos-category-off/pos-category-off';
import { OrderCard } from '../../components/order-card/order-card';
import { SearchDrink } from '../../../../shared/components/search-drink/search-drink';
import { OrderQuickView } from '../../components/order-quick-view/order-quick-view';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order',
  imports: [PosCategoryOff, OrderCard, SearchDrink, OrderQuickView],
  templateUrl: './order.html',
  styleUrls: ['./order.css'],
})
export class Order implements OnInit {
  categories = signal<CategoryWithProductCountDto[]>([]);
  selectedCategory = signal<CategoryWithProductCountDto | null>(null);

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.getCategories().subscribe({
      next: (data) => {
        console.log('Categories from API:', data);
        this.categories.set(data);
        if (data.length) this.selectedCategory.set(data[0]);
      },
      error: (err) => console.error('Failed to load categories:', err),
    });
  }

  onCategoryClick(category: CategoryWithProductCountDto) {
    this.selectedCategory.set(category);
  }
}
