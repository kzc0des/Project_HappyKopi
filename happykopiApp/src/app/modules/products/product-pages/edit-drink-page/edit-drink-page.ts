import { Component, OnInit, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SizeCard } from '../../components/size-card/size-card';
import { AddButtonCard } from '../../components/add-button-card/add-button-card';
import { FieldCard } from '../../components/field-card/field-card';
import { ToggleCard } from '../../components/toggle-card/toggle-card';
import { EditPhotoCard } from '../../components/edit-photo-card/edit-photo-card';
import { CategoryDropdown } from '../../components/category-dropdown/category-dropdown';
import { EditIngredientCard } from '../../components/edit-ingredient-card/edit-ingredient-card';
import { Itemcard } from '../../../../shared/components/itemcard/itemcard';
import { DropdownButton } from '../../../../shared/components/dropdown-button/dropdown-button';
import { ModifierSizeCard } from '../../components/modifier-size-card/modifier-size-card';
import { SelectedAddonCard } from '../../components/selected-addon-card/selected-addon-card';
import { SelectedIngredientCard } from '../../components/selected-ingredient-card/selected-ingredient-card';
import { ModifierDto } from '../../../../core/dtos/product/dropdowns/modifier-dto';
import { AddOnItem, ProductDetailDto, ProductUpdateDto, ProductVariantDetailDto, RecipeItem } from '../../../../core/dtos/product/product.model';
import { HeaderService } from '../../../../core/services/header/header.service';
import { ToggleButton } from "../../../../shared/components/toggle-button/toggle-button";
import { AddAddonModal } from '../../components/add-addon-modal/add-addon-modal';
import { AddIngredientModal } from '../../components/add-ingredient-modal/add-ingredient-modal';
import { ModalService } from '../../services/modal-service/modal.service';
import { DropdownOption } from '../../../../shared/components/dropdown-button/dropdown-option';
import { CategoryDto } from '../../../../core/dtos/product/dropdowns/category-dto';
import { StockItemDto } from '../../../../core/dtos/product/dropdowns/stock-item-dto';
import { ConfirmationService } from '../../../../core/services/confirmation/confirmation.service';
import { ProductsService } from '../../services/products-service/products.service';
import { LoadingService } from '../../../../core/services/loading/loading.service';

@Component({
  selector: 'app-edit-drink-page',
  imports: [
    FormsModule,
    CommonModule,
    Itemcard,
    ModifierSizeCard,
    SelectedAddonCard,
    SelectedIngredientCard,
    DropdownButton,
    ToggleButton,
    AddButtonCard,
    AddAddonModal,
    AddIngredientModal
  ],
  templateUrl: './edit-drink-page.html',
  styleUrl: './edit-drink-page.css'
})
export class EditDrinkPage implements OnInit {
  productPayload!: ProductDetailDto;
  displayVariants: ProductVariantDetailDto[] = [];
  availableSizes: ModifierDto[] = [];
  selectedSizeId = signal<number | null>(null);
  imagePreview: string | ArrayBuffer | null = null;

  imageFile: File | null = null;
  editingIngredient: RecipeItem | null = null;
  editingIngredientIndex: number | null = null;
  editingAddOn: AddOnItem | null = null;
  editingAddOnIndex: number | null = null;

  public categoryOptions: DropdownOption[] = [];
  public ingredientOptions: DropdownOption[] = [];
  public addOnOptions: DropdownOption[] = [];

  public itemOptions: DropdownOption[] = [];

  constructor(
    private route: ActivatedRoute,
    private headerService: HeaderService,
    private router: Router,
    private modalService: ModalService,
    private confirmationService: ConfirmationService,
    private productsService: ProductsService,
    private loadingService: LoadingService
  ) { }

  ngOnInit() {

    this.fetchInitialData();

    if (this.productPayload?.variants?.length > 0) {
      this.selectedSizeId.set(this.productPayload.variants[0].sizeId);
    }

    this.imagePreview = this.productPayload.imageUrl;

    this.headerService.action$.subscribe(async action => {
      if (action === "SAVE") {
        const confirm = await this.confirmationService.confirm(
          "Save Product?",
          "Make sure that all the details are correct and complete.",
          "primary",
          "Save",
          "Cancel"
        );
        if (confirm) this.updateProduct();


      } else if (action === "DELETE") {
        const confirm = await this.confirmationService.confirm(
          "Delete Product?",
          "Are you sure you want to delete this product?",
          "danger",
          "Delete",
          "Cancel"
        );
        if (confirm) this.deleteProduct();


      }
    })
  }

  fetchInitialData() {
    const categoriesData: CategoryDto[] = this.route.snapshot.data['categories'] || [];
    const ingredientsData: StockItemDto[] = this.route.snapshot.data['ingredients'] || [];
    const addOnsData: ModifierDto[] = this.route.snapshot.data['addOns'] || [];
    this.availableSizes = this.route.snapshot.data['sizes'] || [];
    this.productPayload = this.route.snapshot.data['drink'] || [];


    console.log(`Payload: ${JSON.stringify(this.productPayload)}`);
    // console.log(`Sizes: ${JSON.stringify(this.availableSizes)}`);
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

  currentVariant = computed(() => {
    const sizeId = this.selectedSizeId();
    console.log(`Selected Size ID: ${sizeId}`);
    console.log(`Variant Id: ${this.productPayload.variants[0].sizeId}`);
    if (sizeId === null) return undefined;
    return this.productPayload.variants.find(v => v.sizeId === sizeId);
  });

  get currentPrice(): number {
    const variant = this.currentVariant();
    if (variant) {
      return variant.price;
    }
    return 0;
  }

  onFileChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    this.imageFile = file || null;
  }

  onSizeSelect(size: ModifierDto) {
    this.selectedSizeId.set(size.id);
  }

  openIngredientModal() {
    if (this.selectedSizeId() === null) return;
    this.resetEditingState();
    this.modalService.openIngredientModal();
  }

  openAddOnModal() {
    if (this.selectedSizeId() === null) return;
    this.resetEditingState();
    this.modalService.openAddOnModal();
  }

  onSaveIngredient(item: RecipeItem) {
    if (this.currentVariant()) {
      if (this.editingIngredientIndex !== null) {
        this.currentVariant()!.recipe[this.editingIngredientIndex!] = item;
        console.log('Updated Ingredient:', item);
      } else {
        this.currentVariant()!.recipe.push(item);
      }
      console.log('Updated Variants Payload:', this.productPayload.variants);
    } else {
      console.error('No size selected to add or update ingredient.');
    }
    this.resetEditingState();
  }

  onEditIngredient(ingredient: RecipeItem, index: number) {
    if (this.selectedSizeId() === null) return;
    this.editingIngredient = { ...ingredient };
    this.editingIngredientIndex = index;
    this.modalService.openIngredientModal();
    console.log('Editing ingredient:', this.editingIngredient);
  }

  onDeleteIngredient(): void {
    if (this.currentVariant() && this.editingIngredientIndex !== null) {
      this.currentVariant()!.recipe.splice(this.editingIngredientIndex!, 1);
      console.log('Deleted ingredient at index:', this.editingIngredientIndex);
      console.log('Updated Variants Payload:', this.productPayload.variants);
    } else {
      console.error('No ingredient selected for deletion or no size selected.');
    }
    this.resetEditingState();
  }

  onSaveAddOn(item: AddOnItem) {
    if (this.currentVariant()) {
      if (this.editingAddOnIndex !== null) {
        // Update existing add-on
        this.currentVariant()!.addOns[this.editingAddOnIndex!] = item;
        console.log('Updated Add-on:', item);
      } else {
        // Add new add-on
        this.currentVariant()!.addOns.push(item);
      }
      console.log('Updated Variants Payload:', this.productPayload.variants);
    } else {
      console.error('No size selected to add or update add-on.');
    }
    this.resetEditingState();
  }

  onEditAddOn(addOn: AddOnItem, index: number) {
    if (this.selectedSizeId() === null) return;
    this.editingAddOn = { ...addOn };
    this.editingAddOnIndex = index;
    this.modalService.openAddOnModal();
  }

  onDeleteAddOn(): void {
    if (this.currentVariant() && this.editingAddOnIndex !== null) {
      this.currentVariant()!.addOns.splice(this.editingAddOnIndex!, 1);
      console.log('Deleted add-on at index:', this.editingAddOnIndex);
      console.log('Updated Variants Payload:', this.productPayload.variants);
    } else {
      console.error('No add-on selected for deletion or no size selected.');
    }
    this.resetEditingState();
  }

  private resetEditingState() {
    this.editingIngredient = null;
    this.editingIngredientIndex = null;
    this.editingAddOn = null;
    this.editingAddOnIndex = null;
  }

  trackByIngredientId(index: number, ingredient: RecipeItem): string {
    return `${ingredient.ingredientId}-${index}`;
  }

  trackByAddOnId(index: number, addOn: AddOnItem): string {
    return `${addOn.addOnId}-${index}`;
  }

  async updateProduct() {
    this.loadingService.show();

    const updatePayload: ProductUpdateDto = {
      name: this.productPayload.name,
      description: this.productPayload.description,
      categoryId: this.productPayload.categoryId,
      isAvailable: this.productPayload.isAvailable,
      isActive: this.productPayload.isActive,
      imageFile: this.imageFile,
      variants: this.productPayload.variants.map(variant => ({
        SizeId: variant.sizeId,
        Price: variant.price,
        Recipe: variant.recipe.map(ingredient => ({
          StockItemId: ingredient.ingredientId,
          QuantityNeeded: ingredient.quantityNeeded
        })),
        AddOns: variant.addOns.map(addOn => ({
          ModifierId: addOn.addOnId,
          DefaultQuantity: addOn.times
        }))
      }))
    };

    this.productsService.updateProduct(this.productPayload.id, updatePayload).subscribe({
      next: () => {
        this.loadingService.hide();
        this.router.navigate(['../'], { relativeTo: this.route });
      },
      error: (err) => this.loadingService.hide()
    });
  }

  async deleteProduct() {
    this.loadingService.show();
    this.productsService.deleteProduct(this.productPayload.id).subscribe({
      next: () => {
        this.loadingService.hide();
        this.router.navigate(['../../../'], { relativeTo: this.route });
      },
      error: (err) => {
        this.loadingService.hide();
      }
    });
  }
}
