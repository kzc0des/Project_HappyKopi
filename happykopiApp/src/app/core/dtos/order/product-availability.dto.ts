// core/dtos/order/product-availability.dto.ts
export interface IngredientIssueDto {
  ingredientName: string;
  required: number;
  available: number;
  unitOfMeasure: string;
  expiredBatchCount: number | null;
  totalBatchCount: number | null;
}

export interface UnavailableProductDto {
  productId: number;
  productName: string;
  categoryName: string;
  price: number;
  imageUrl: string | null;
  reason: string;
  details: IngredientIssueDto[];
}

export interface ProductWithAvailabilityDto {
  productId: number;
  productName: string;
  categoryName: string;
  price: number;
  imageUrl: string | null;
  isAvailable: boolean;
}

export interface ProductAvailabilityResponseDto {
  availableProducts: ProductWithAvailabilityDto[];
  unavailableProducts: UnavailableProductDto[];
}