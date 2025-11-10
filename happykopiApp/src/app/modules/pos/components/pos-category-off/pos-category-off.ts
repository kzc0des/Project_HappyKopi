import { Component, Input } from '@angular/core';
import { CategoryWithProductCountDto } from '../../../../core/dtos/order/category-with-product-count.dto';

@Component({
  selector: 'app-pos-category-off',
  templateUrl: './pos-category-off.html',
  styleUrls: ['./pos-category-off.css']
})
export class PosCategoryOff {
  @Input() mode: 'active' | 'inactive' = 'inactive';
  @Input() categoryCard!: CategoryWithProductCountDto;
}
