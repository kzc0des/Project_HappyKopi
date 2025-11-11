import { OrderVariantAddonDto } from './order-variant-addon.dto';
import { OrderVariantIngredientDto } from './order-variant-ingredient.dto';
import { OrderVariantDto } from './order-variant.dto';

export interface ProductConfigurationResultDto {
  variants: OrderVariantDto[];
  ingredients: OrderVariantIngredientDto[];
  addOns: OrderVariantAddonDto[];
}
