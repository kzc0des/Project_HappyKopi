import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AddOnItem, ProductDetailDto, ProductVariantDetailDto, RecipeItem } from '../../../../core/dtos/product/product.model';
import { Itemcard } from '../../../../shared/components/itemcard/itemcard';
import { ModifierSizeCard } from '../../components/modifier-size-card/modifier-size-card';
import { SelectedAddonCard } from '../../components/selected-addon-card/selected-addon-card';
import { SelectedIngredientCard } from '../../components/selected-ingredient-card/selected-ingredient-card';
import { ModifierDto } from '../../../../core/dtos/product/dropdowns/modifier-dto';
import { AvailabilityCard } from "../../../../shared/components/availability-card/availability-card";
import { HeaderService } from '../../../../core/services/header/header.service';
import { Subscription } from 'rxjs';
import { ProductsService } from '../../services/products-service/products.service';
import { ConfirmationService } from '../../../../core/services/confirmation/confirmation.service';

@Component({
  selector: 'app-drink-detail-page',
  imports: [CommonModule, Itemcard, ModifierSizeCard, SelectedAddonCard, SelectedIngredientCard, FormsModule, AvailabilityCard],
  templateUrl: './drink-detail-page.html',
  styleUrl: './drink-detail-page.css'
})
export class DrinkDetailPage implements OnInit {
  productPayload!: ProductDetailDto;
  displayVariants: ProductVariantDetailDto[] = [];
  availableSizes: ModifierDto[] = [];
  selectedSizeId: number | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  private subscriptions = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private headerService: HeaderService,
    private router: Router,
    private productsService: ProductsService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.productPayload = this.route.snapshot.data['drink'];
    this.headerService.resetAction();

    this.displayVariants = this.productPayload.variants;

    // Group variants by sizeId to avoid duplicates in the UI
    const uniqueSizesMap = new Map<number, ModifierDto>();
    this.displayVariants.forEach(variant => {
      if (!uniqueSizesMap.has(variant.sizeId)) {
        uniqueSizesMap.set(variant.sizeId, {
          id: variant.sizeId, // Use sizeId for selection logic
          name: variant.size,
          price: variant.price,
          ozAmount: variant.ozAmount
        });
      }
    });
    this.availableSizes = Array.from(uniqueSizesMap.values());

    if (this.availableSizes.length > 0) {
      this.selectedSizeId = this.availableSizes[0].id;
    }

    this.imagePreview = this.productPayload.imageUrl;

    if (!this.productPayload.isActive) {
      this.headerService.emitAction('SHOW_RESTORE');
    }

    this.subscriptions.add(
      this.headerService.action$.subscribe(async action => {
        if (action === "EDIT") {
          this.router.navigate(['edit'], {
            relativeTo: this.route
          });
        } else if (action === "BACK") {
          this.router.navigate(['/app/products'], {replaceUrl: true});
        } else if (action === 'RESTORE') {
          const confirmed = await this.confirmationService.confirm(
            'Restore Product?',
            `This will make the product active again.`,
            'primary', 'Restore', 'Cancel'
          );
          if (confirmed) {
            this.restoreProduct();
          }
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.headerService.emitAction('HIDE_RESTORE');
  }

  restoreProduct(): void {
    this.subscriptions.add(
      this.productsService.restoreProduct(this.productPayload.id).subscribe({
        next: () => {
          console.log('Product restored successfully');
          this.router.navigate(['/app/products']);
        },
        error: (err) => {
          console.error('Failed to restore product', err);
        }
      })
    );
  }

  get currentVariant(): ProductVariantDetailDto | undefined {
    if (this.selectedSizeId === null) {
      return undefined;
    }
    return this.displayVariants.find(v => v.sizeId === this.selectedSizeId);
  }

  get currentPrice(): number {
    const variant = this.currentVariant;
    if (variant) {
      return variant.price;
    }
    return 0;
  }

  onSizeSelect(size: ModifierDto) {
    this.selectedSizeId = size.id;
  }
}