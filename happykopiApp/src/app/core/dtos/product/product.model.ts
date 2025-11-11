import { ProductCreateDto } from "./product-create-dto";

export interface RecipeItem {
  ingredientId: number; 
  quantityNeeded: number;
  ingredientName: string; 
  unitOfMeasure: string;  
}

export interface AddOnItem {
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
  id: number;
}

