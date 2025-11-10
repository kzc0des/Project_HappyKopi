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
