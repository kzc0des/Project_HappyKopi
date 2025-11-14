export interface OrderVariantIngredientDto {
  productVariantId: number;
  stockItemId: number;
  stockItemName: string;
  quantityNeeded: number;
  availableStock: number;
  isModifierIngredient: number;
  modifierId: number | null; 
}
