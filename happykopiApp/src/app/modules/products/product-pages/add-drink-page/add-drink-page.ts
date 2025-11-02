import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AddButtonCard } from '../../components/add-button-card/add-button-card';

import { Itemcard } from '../../../../shared/components/itemcard/itemcard';
import { DropdownButton } from '../../../../shared/components/dropdown-button/dropdown-button';
import { ModifierSizeCard } from "../../components/modifier-size-card/modifier-size-card";
import { AddIngredientModal } from "../../components/add-ingredient-modal/add-ingredient-modal";
import { ModalService } from '../../services/modal-service/modal.service';
import { AddAddonModal } from "../../components/add-addon-modal/add-addon-modal";

import { DropdownOption } from '../../../../shared/components/dropdown-button/dropdown-option';

import { AddOnItem } from '../../../../core/dtos/product/product.model';
import { RecipeItem } from '../../../../core/dtos/product/product.model';
import { ProductCreateDto } from '../../../../core/dtos/product/product-create-dto';
import { ProductVariantAddOnCreateDto } from '../../../../core/dtos/product/product-variant-add-on-create-dto';
import { ProductVariantCreateDto } from '../../../../core/dtos/product/product-variant-create-dto';
import { ProductVariantIngredientCreateDto } from '../../../../core/dtos/product/product-variant-ingredient-create-dto';
import { YellowButton } from '../../../../shared/components/yellow-button/yellow-button';


export interface ModifierSize {
  id: number;
  name: string; // e.g., "Tall", "Grande"
  ozAmount: number;
}

@Component({
  selector: 'app-add-drink-page',
  imports: [
    FormsModule,
    CommonModule,
    AddButtonCard,
    Itemcard,
    DropdownButton,
    ModifierSizeCard,
    AddIngredientModal,
    AddAddonModal,
    YellowButton
  ],
  templateUrl: './add-drink-page.html',
  styleUrl: './add-drink-page.css'
})
export class AddDrinkPage implements OnInit {
  isDropdownOpen = false;
  drink: string;

  availableSizes: ModifierSize[] = [];
  selectedSizeId: number | null = 1;

  public productPayload: ProductCreateDto;

  public categoryOptions: DropdownOption[] = [];
  public ingredientOptions: DropdownOption[] = [];
  public addOnOption: DropdownOption[] = [];

  isRecipeBuilderVisible = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalService: ModalService
  ) {
    const nav = this.router.getCurrentNavigation();
    this.drink = nav?.extras.state?.['drink'];
    
    this.productPayload = this.initializeEmptyPayload();
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('name');
    this.fetchSizesFromDatabase();
    
    this.initializeVariants();

    this.fetchModalOptions();
  }

  fetchSizesFromDatabase() {
    this.availableSizes = [
      { id: 1, name: 'Tall', ozAmount: 12 },
      { id: 2, name: 'Grande', ozAmount: 16 },
      { id: 3, name: 'Venti', ozAmount: 20 }
    ];
  }

  initializeEmptyPayload(): ProductCreateDto {
    return {
      name: '',
      description: '',  
      imageUrl: '',  
      categoryId: 0, 
      isAvailable: true,
      isActive: true,
      variants: []
    };
  }

  initializeVariants() {
    this.productPayload.variants = this.availableSizes.map(size => ({
      size: size.name,
      price: 0,
      recipe: [],
      addOns: []
    }));
  }

  fetchModalOptions() {
    this.categoryOptions = [{ value: 1, label: 'Syrups' }, { value: 2, label: 'Powders' }];
    this.ingredientOptions = [{ value: 101, label: 'Vanilla Syrup (101)' }, { value: 202, label: 'Matcha Powder (202)' }];
    this.addOnOption = [{ value: 5, label: 'Pearl (5)' }, { value: 6, label: 'Nata (6)' }, { value: 7, label: 'Cream Cheese (7)' }];
  }


  private get currentVariantIndex(): number {
    if (this.selectedSizeId === null) return -1;
    const sizeName = this.availableSizes.find(s => s.id === this.selectedSizeId)?.name;
    if (!sizeName) return -1;
    return this.productPayload.variants.findIndex(v => v.size === sizeName);
  }

  public get currentVariant(): ProductVariantCreateDto | null {
    const index = this.currentVariantIndex;
    return index !== -1 ? this.productPayload.variants[index] : null;
  }

  get currentVariantPrice(): number {
    return this.currentVariant?.price ?? 0;
  }
  
  set currentVariantPrice(value: number) {
    if (this.currentVariant) {
      this.currentVariant.price = value;
    }
  }


  onSizeSelect(sizeId: number) {
    this.selectedSizeId = sizeId;
  }

  openIngredientModal() {
    if (this.selectedSizeId === null) return; 
    this.modalService.openIngredientModal();
  }

  openAddOnModal() {
    if (this.selectedSizeId === null) return;
    this.modalService.openAddOnModal();
  }

  handleSaveIngredient(recipeItem: RecipeItem) {
    const variant = this.currentVariant;
    if (!variant || !recipeItem.stockItemId) return;

    const newIngredient: ProductVariantIngredientCreateDto = {
      stockItemId: recipeItem.stockItemId,
      quantityNeeded: recipeItem.quantityNeeded
    };

    const existingIndex = variant.recipe.findIndex(r => r.stockItemId === newIngredient.stockItemId);
    if (existingIndex > -1) {
      variant.recipe[existingIndex] = newIngredient;
    } else {
      variant.recipe.push(newIngredient);
    }
    
    this.modalService.closeIngredientModal();
    console.log('Updated Payload:', this.productPayload);
  }

  handleSaveAddOn(addOnItem: AddOnItem) {
    const variant = this.currentVariant;
    if (!variant || !addOnItem.addOnId) return;

    const newAddOn: ProductVariantAddOnCreateDto = {
      addOnId: addOnItem.addOnId,
      times: addOnItem.times
    };

    const existingIndex = variant.addOns.findIndex(a => a.addOnId === newAddOn.addOnId);
    if (existingIndex > -1) {
      variant.addOns[existingIndex] = newAddOn;
    } else {
      variant.addOns.push(newAddOn);
    }

    this.modalService.closeAddOnModal();
    console.log('Updated Payload:', this.productPayload);
  }

  submitNewProduct() {
    if (!this.productPayload.name) {
      alert('Product name is required.');
      return;
    }
    if (!this.productPayload.categoryId) {
      alert('Category is required.');
      return;
    }
    const variantWithoutPrice = this.productPayload.variants.find(v => v.price <= 0);
    if (variantWithoutPrice) {
      alert(`Please set a price for the ${variantWithoutPrice.size} variant.`);
      return;
    }

    console.log('FINAL PAYLOAD TO SUBMIT:', JSON.stringify(this.productPayload, null, 2));
  }
}