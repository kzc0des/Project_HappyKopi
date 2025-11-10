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
import { ModifierDto } from '../../../../core/dtos/product/dropdowns/modifier-dto';
import { CategoryDto } from '../../../../core/dtos/product/dropdowns/category-dto';
import { StockItemDto } from '../../../../core/dtos/product/dropdowns/stock-item-dto';

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

  availableSizes: ModifierDto[] = [];
  selectedSizeId: number | null = 1;

  public productPayload: ProductCreateDto;

  public categoryOptions: DropdownOption[] = [];
  public ingredientOptions: DropdownOption[] = [];
  public addOnOptions: DropdownOption[] = [];
  public itemOptions: DropdownOption[] = [];

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
    const categoriesData: CategoryDto[] = this.route.snapshot.data['categories'] || [];
    const ingredientsData: StockItemDto[] = this.route.snapshot.data['ingredients'] || [];
    const addOnsData: ModifierDto[] = this.route.snapshot.data['addOns'] || [];
    this.availableSizes = this.route.snapshot.data['sizes'] || [];

    this.initializeVariants();

    this.categoryOptions = categoriesData.map(category => ({
      value: category.id,
      label: category.name
    }));

    this.ingredientOptions = ingredientsData.map(item => ({
      value: item.id,
      label: `${item.name} (${item.unitOfMeasure})`,
      type: item.itemType
    }));

    this.addOnOptions = addOnsData.map(modifier => ({
      value: modifier.id,
      label: `${modifier.name} (+₱${modifier.price})`
    }));

    this.itemOptions = [
      {
        value: 'Liquid',
        label: 'Liquid'
      },
      {
        value: 'Powder',
        label: 'Powder'
      }
    ]
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
      sizeId: size.id,
      size: size.name,
      price: 0,
      recipe: [],
      addOns: []
    }));

    if (this.productPayload.variants.length > 0) {
      this.selectedSizeId = this.productPayload.variants[0].sizeId;
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

  onSaveIngredient(item: ProductVariantIngredientCreateDto) {
    if (!this.selectedSizeId) {
      console.error('No size selected to add ingredient to.');
      return;
    }

    const currentVariant = this.productPayload.variants.find(
      v => v.sizeId === this.selectedSizeId
    );

    if (currentVariant) {
      currentVariant.recipe.push(item);
      // console.log('Updated Variants Payload:', this.productPayload.variants);
    }
  }

  onSaveAddOn(item: ProductVariantAddOnCreateDto) {
    if (!this.selectedSizeId) {
      console.error('No size selected to add add-on to.');
      return;
    }

    const currentVariant = this.productPayload.variants.find(
      v => v.sizeId === this.selectedSizeId
    );

    if (currentVariant) {
      currentVariant.addOns.push(item);
      // console.log('Updated Variants Payload:', this.productPayload.variants);
    }
  }

  submitNewProduct() {
    // if (!this.productPayload.name) {
    //   alert('Product name is required.');
    //   return;
    // }
    // if (!this.productPayload.categoryId) {
    //   alert('Category is required.');
    //   return;
    // }
    // const variantWithoutPrice = this.productPayload.variants.find(v => v.price <= 0);
    // if (variantWithoutPrice) {
    //   alert(`Please set a price for the ${variantWithoutPrice.size} variant.`);
    //   return;
    // }

    // this.productsService.createProduct(this.productPayload).subscribe({
    //   next: (response) => {
    //     console.log('Product created successfully with ID:', response.productId);
    //     alert('Product created successfully!');
    //   },
    //   error: (error) => {
    //     console.error('Error creating product:', error);
    //     alert('Failed to create product. See console for details.');
    //   }
    // });

    console.log(this.productPayload);
  }
}