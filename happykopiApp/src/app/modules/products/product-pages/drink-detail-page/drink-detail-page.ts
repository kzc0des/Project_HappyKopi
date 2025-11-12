import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { IngredientCard } from '../../components/ingredient-card/ingredient-card';
import { SizeCard } from '../../components/size-card/size-card';
import { ProductsInfoCard } from '../../components/products-info-card/products-info-card';
import { ProductDetailDto } from '../../../../core/dtos/product/product.model';
import { Itemcard } from '../../../../shared/components/itemcard/itemcard';
import { ModifierSizeCard } from '../../components/modifier-size-card/modifier-size-card';
import { SelectedAddonCard } from '../../components/selected-addon-card/selected-addon-card';
import { SelectedIngredientCard } from '../../components/selected-ingredient-card/selected-ingredient-card';

@Component({
  selector: 'app-drink-detail-page',
  imports: [CommonModule, Itemcard, ModifierSizeCard, SelectedAddonCard, SelectedIngredientCard, FormsModule],
  templateUrl: './drink-detail-page.html',
  styleUrl: './drink-detail-page.css'
})
export class DrinkDetailPage implements OnInit {
  productPayload!: ProductDetailDto;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.productPayload = this.route.snapshot.data['drink'];
  }
}