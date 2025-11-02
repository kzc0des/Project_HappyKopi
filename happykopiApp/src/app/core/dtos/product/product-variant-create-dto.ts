import { ProductVariantAddOnCreateDto } from "./product-variant-add-on-create-dto";
import { ProductVariantIngredientCreateDto } from "./product-variant-ingredient-create-dto";

export interface ProductVariantCreateDto {
    size: string;
    price: number;
    recipe: ProductVariantIngredientCreateDto[];
    addOns: ProductVariantAddOnCreateDto[];
}
