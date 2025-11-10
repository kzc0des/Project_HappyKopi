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
import { ProductsService } from '../../services/products-service/products.service';


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

  public imagePreview: string | ArrayBuffer | null = null;

  isRecipeBuilderVisible = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalService: ModalService,
    private productsService: ProductsService
  ) {
    const nav = this.router.getCurrentNavigation();
    this.drink = nav?.extras.state?.['drink'];
    
    this.productPayload = this.initializeEmptyPayload();
  }

  ngOnInit() {
    this.fetchInitialData();
  }

  fetchInitialData() {
    this.route.data.subscribe(data => {
      this.availableSizes = data['sizes'];
      this.categoryOptions = data['categories'];
      this.ingredientOptions = data['ingredients'];
      this.addOnOption = data['addOns'];

      if (this.availableSizes.length > 0) {
        this.selectedSizeId = this.availableSizes[0].id;
      }
      this.initializeVariants();
    });
  }

  initializeEmptyPayload(): ProductCreateDto {
    return {
      name: '',
      description: '',  
      imageFile: null,  
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

  onFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList && fileList[0]) {
      const file = fileList[0];
      const maxFileSize = 2 * 1024 * 1024; // 2MB

      if (file.size > maxFileSize) {
        alert('File size exceeds 2MB. Please choose a smaller file.');
        element.value = ''; // Reset the file input
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
        this.productPayload.imageFile = file;
      };
      reader.readAsDataURL(file);
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

    this.productsService.createProduct(this.productPayload).subscribe({
      next: (response) => {
        console.log('Product created successfully with ID:', response.productId);
        alert('Product created successfully!');
        // Optionally, navigate to another page
        // this.router.navigate(['/products']);
      },
      error: (error) => {
        console.error('Error creating product:', error);
        alert('Failed to create product. See console for details.');
      }
    });
  }
}