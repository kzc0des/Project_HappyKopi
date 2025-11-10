import { ProductVariantAddOnCreateDto } from "./product-variant-add-on-create-dto";
import { ProductVariantIngredientCreateDto } from "./product-variant-ingredient-create-dto";

export interface ProductVariantCreateDto {
    Size: string;
    Price: number;
    Recipe: ProductVariantIngredientCreateDto[];
    AddOns: ProductVariantAddOnCreateDto[];
}
