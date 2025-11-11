export interface OrderVariantDto {
  id: number;
  productId: number;
  size: string;
  price: number; // Use 'number' for decimal/money types in TypeScript
}