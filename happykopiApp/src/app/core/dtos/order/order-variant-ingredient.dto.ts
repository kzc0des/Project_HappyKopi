export interface OrderVariantIngredientDto {
  productVariantId: number;
  stockItemId: number;
  stockItemName: string;
  quantityNeeded: number;
  availableStock: number;
}
