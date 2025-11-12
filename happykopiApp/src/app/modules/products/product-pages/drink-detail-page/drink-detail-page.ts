import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AddOnItem, ProductDetailDto, ProductVariantDetailDto, RecipeItem } from '../../../../core/dtos/product/product.model';
import { Itemcard } from '../../../../shared/components/itemcard/itemcard';
import { ModifierSizeCard } from '../../components/modifier-size-card/modifier-size-card';
import { SelectedAddonCard } from '../../components/selected-addon-card/selected-addon-card';
import { SelectedIngredientCard } from '../../components/selected-ingredient-card/selected-ingredient-card';
import { ModifierDto } from '../../../../core/dtos/product/dropdowns/modifier-dto';

@Component({
  selector: 'app-drink-detail-page',
  imports: [CommonModule, Itemcard, ModifierSizeCard, SelectedAddonCard, SelectedIngredientCard, FormsModule],
  templateUrl: './drink-detail-page.html',
  styleUrl: './drink-detail-page.css'
})
export class DrinkDetailPage implements OnInit {
  productPayload!: ProductDetailDto;
  displayVariants: ProductVariantDetailDto[] = [];
  availableSizes: ModifierDto[] = [];
  selectedSizeId: number | null = null;
  basePrice: number = 0;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.productPayload = this.route.snapshot.data['drink'];
    // Filter variants to only include those with recipes or add-ons
    this.displayVariants = this.productPayload.variants.filter(variant => 
      (variant.recipe && variant.recipe.length > 0) || (variant.addOns && variant.addOns.length > 0)
    );

    this.availableSizes = this.displayVariants.map(variant => ({
      id: variant.id,
      name: variant.size,
      price: variant.price,
      ozAmount: variant.ozAmount
      // ozAmount is optional and not present on ProductVariantDetailDto, so it's omitted
    }));

    if (this.availableSizes.length > 0) {
      this.selectedSizeId = this.availableSizes[0].id;
    }

    this.imagePreview = this.productPayload.imageUrl;

    console.log(this.productPayload);
    console.log(this.displayVariants);
    console.log(this.availableSizes);
  }

  get currentVariant(): ProductVariantDetailDto | undefined {
    if (this.selectedSizeId === null) {
      return undefined;
    }
    return this.displayVariants.find(v => v.id === this.selectedSizeId);
  }

  onSizeSelect(size: ModifierDto) {
    this.selectedSizeId = size.id;
  }
}