export interface OrderVariantIngredientDto {
  productVariantId: number;
  stockItemId: number;
  quantityNeeded: number; // Use 'number' for decimal types
}