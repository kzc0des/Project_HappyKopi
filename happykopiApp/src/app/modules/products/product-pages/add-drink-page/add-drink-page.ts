import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
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
import { HeaderService } from '../../../../core/services/header/header.service';
import { AlertService } from '../../../../core/services/alert/alert.service';

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
    private productsService: ProductsService,
    private headerService: HeaderService,
    private alertService: AlertService
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
      const maxFileSize = 2 * 1024 * 1024;

      if (file.size > maxFileSize) {
        alert('File size exceeds 2MB. Please choose a smaller file.');
        element.value = '';
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

  submitNewProduct(productForm: NgForm) {
    productForm.form.markAllAsTouched();

    if (productForm.invalid) {
      console.log("Form is invalid. Please check errors.");
      return;
    }

    const payloadForBackend: ProductCreateDto = {
      name: this.productPayload.name,
      categoryId: this.productPayload.categoryId,
      imageFile: this.productPayload.imageFile,
      isAvailable: true,
      isActive: true,
      description: this.productPayload.description || undefined,

      variants: this.productPayload.variants.map(uiVariant => {

        const leanRecipe: ProductVariantIngredientCreateDto[] = uiVariant.recipe.map(
          (richIngredient) => ({
            StockItemId: richIngredient.ingredientId,
            QuantityNeeded: richIngredient.quantityNeeded
          })
        );

        const leanAddOns: ProductVariantAddOnCreateDto[] = uiVariant.addOns.map(
          (richAddOn) => ({
            ModifierId: richAddOn.addOnId,
            DefaultQuantity: richAddOn.times
          })
        );

        const sumOfAddOns = uiVariant.addOns.reduce(
          (total, addon) => total + (addon.price * addon.times),
          0
        )

        const leanVariant: ProductVariantCreateDto = {
          Size: uiVariant.size,
          Price: uiVariant.price + sumOfAddOns + (this.basePrice || 0),
          Recipe: leanRecipe,
          AddOns: leanAddOns
        };

        return leanVariant;
      })
    };

    console.log('Final payload for backend:', payloadForBackend);

    this.productsService.createProduct(payloadForBackend).subscribe({
      next: async (response) => {        
        console.log('Product created successfully!', response);
        this.headerService.notifyItemAdded(true);
        await this.alertService.showSuccess(
          'Success!',
          'Product has been created successfully.'
        );
        this.router.navigate(['../'], { relativeTo: this.route, replaceUrl: true });
      },

      error: async (err) => {
        console.error('Failed to create product (Full Error Object):', err);

        let displayMessage = 'An unexpected error occurred. Please try again.';

        if (err.status === 409) {
          displayMessage = err.error?.message || 'A product with this name might already exist.';

        } else if (err.status === 400) {
          if (err.error && typeof err.error === 'string') {
            displayMessage = `Error (400):\n${err.error}`;

          } else if (err.error && err.error.errors) {
            try {
              const validationErrors = Object.values(err.error.errors) as string[];
              displayMessage = `Validation Failed (400):\n- ${validationErrors.join('\n- ')}`;
            } catch {
              displayMessage = '400 Bad Request: Validation error (could not parse).';
            }

          } else if (err.error?.message) {
            displayMessage = `Error (400):\n${err.error.message}`;

          } else {
            displayMessage = '400 Bad Request: Check console for error object.';
          }

        } else if (err.status === 500) {
          displayMessage = '500 Internal Server Error. Check the backend logs.';
        }

        await this.alertService.showError(
          'Failed',
          'An error occurred while creating the product.'
        );
      }
    });
  }
}