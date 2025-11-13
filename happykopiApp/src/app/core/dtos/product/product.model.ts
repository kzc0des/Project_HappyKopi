import { ProductCreateDto } from "./product-create-dto";

export interface RecipeItem {
  productVariantId?: number; // For mapping from backend
  ingredientId: number; 
  quantityNeeded: number;
  ingredientName: string; 
  unitOfMeasure: string;  
}

export interface AddOnItem {
  productVariantId?: number; // For mapping from backend
  addOnId: number;
  times: number;
  modifierName: string;
  price: number;
}

export interface ProductVariantCreateDtoUI {
  sizeId: number;
  size: string;
  price: number;
  recipe: RecipeItem[];
  addOns: AddOnItem[];
}

export interface ProductPayloadUI {
  name: string;
  description: string;
  imageFile: File | null;
  categoryId: number;
  variants: ProductVariantCreateDtoUI[];
}

export interface ProductListItemDto {
  id: number;
  name: string;
  categoryName: string;
  imageUrl: string;
}

export interface ProductDetailDto {
  id: number;
  name: string;
  description: string;
  categoryId: number;
  categoryName: string;
  isAvailable: boolean;
  isActive: boolean;
  imageUrl: string;
  imagePublicId: string;
  variants: ProductVariantDetailDto[];
}

export interface ProductUpdateDto extends ProductCreateDto { }

export interface ProductVariantDetailDto extends ProductVariantCreateDtoUI {
  id: number; // This is the ProductVariantId
  ozAmount?: number;
  recipe: RecipeItem[];
  addOns: AddOnItem[];
}
