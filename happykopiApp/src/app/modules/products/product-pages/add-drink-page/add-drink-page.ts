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

import { AddOnItem, ProductPayloadUI, ProductVariantCreateDtoUI } from '../../../../core/dtos/product/product.model';
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

  public productPayload: ProductPayloadUI;

  // dropdown options sent to modals
  public categoryOptions: DropdownOption[] = [];
  public ingredientOptions: DropdownOption[] = [];
  public addOnOptions: DropdownOption[] = [];

  // product category options
  public itemOptions: DropdownOption[] = [];

  // product base price will be added to all the product sizes
  basePrice: number = 0;
  variantPrice: number = 0;

  // image preview

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

  public get currentVariant(): ProductVariantCreateDtoUI | undefined {
    if (this.selectedSizeId === null) {
      return undefined;
    }
    return this.productPayload.variants.find(
      v => v.sizeId === this.selectedSizeId
    );
  }

  ngOnInit() {
    this.fetchInitialData();
  }

  fetchInitialData() {
    const categoriesData: CategoryDto[] = this.route.snapshot.data['categories'] || [];
    const ingredientsData: StockItemDto[] = this.route.snapshot.data['ingredients'] || [];
    const addOnsData: ModifierDto[] = this.route.snapshot.data['addOns'] || [];
    this.availableSizes = this.route.snapshot.data['sizes'] || [];

    console.log(`Sizes: ${JSON.stringify(this.availableSizes)}`);
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
      label: `${modifier.name} (+₱${modifier.price})`,
      price: modifier.price
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

  initializeEmptyPayload(): ProductPayloadUI {
    return {
      name: '',
      description: '',
      imageFile: null,
      categoryId: 0,
      variants: []
    };
  }

  initializeVariants() {
    this.productPayload.variants = this.availableSizes.map(size => ({
      sizeId: size.id,
      size: size.name,
      price: size.price,
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


  onSizeSelect(variant: ModifierDto) {
    this.selectedSizeId = variant.id;
    console.log(`Size Info: ${JSON.stringify(variant)}`);
  }

  openIngredientModal() {
    if (this.selectedSizeId === null) return;
    this.modalService.openIngredientModal();
  }

  openAddOnModal() {
    if (this.selectedSizeId === null) return;
    this.modalService.openAddOnModal();
  }

  onSaveIngredient(item: RecipeItem) {
    if (this.currentVariant) {
      this.currentVariant.recipe.push(item);
      console.log('Updated Variants Payload:', this.productPayload.variants);
    } else {
      console.error('No size selected to add ingredient to.');
    }
  }

  onSaveAddOn(item: AddOnItem) {
    if (this.currentVariant) {
      this.currentVariant.addOns.push(item);
      console.log('Updated Variants Payload:', this.productPayload.variants);
    } else {
      console.error('No size selected to add add-on to.');
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

    const payloadForBackend: ProductCreateDto = {
      name: this.productPayload.name,
      categoryId: this.productPayload.categoryId,
      imageFile: this.productPayload.imageFile,
      isAvailable: true, // Default values
      isActive: true,    // Default values
      description: this.productPayload.description || undefined,

      // I-map ang "rich" UI variants sa "lean" DTO variants
      variants: this.productPayload.variants.map(uiVariant => {

        const leanRecipe: ProductVariantIngredientCreateDto[] = uiVariant.recipe.map(
          (richIngredient) => ({
            stockItemId: richIngredient.ingredientId,
            quantityNeeded: richIngredient.quantityNeeded
          })
        );

        const leanAddOns: ProductVariantAddOnCreateDto[] = uiVariant.addOns.map(
          (richAddOn) => ({
            addOnId: richAddOn.addOnId,
            times: richAddOn.times
          })
        );

        const sumOfAddOns = uiVariant.addOns.reduce(
          (total, addon) => total + (addon.price * addon.times),
          0
        )

        const leanVariant: ProductVariantCreateDto = {
          sizeId: uiVariant.sizeId,
          size: uiVariant.size,
          price: uiVariant.price + sumOfAddOns + (this.basePrice || 0),
          recipe: leanRecipe,
          addOns: leanAddOns
        };

        return leanVariant;
      })
    };

    console.log('Final payload for backend:', payloadForBackend);
  }
}