import { ProductVariantAddOnCreateDto } from "./product-variant-add-on-create-dto";
import { ProductVariantIngredientCreateDto } from "./product-variant-ingredient-create-dto";

export interface ProductVariantCreateDto {
    SizeId: number;
    Price: number;
    Recipe: ProductVariantIngredientCreateDto[];
    AddOns: ProductVariantAddOnCreateDto[];
}
