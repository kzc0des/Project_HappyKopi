export interface RecipeItem {
  stockItemId: number | null;
  quantityNeeded: number;
}

export interface AddOnItem {
  addOnId: number | null;
  times: number;
}

export interface Variant {
  size: string;
  price: number;
  recipe: RecipeItem[];
  addOns: AddOnItem[];
}

export interface ProductPayload {
  name: string;
  description: string;
  imageUrl: string;
  categoryId: number | null;
  isAvailable: boolean;
  isActive: boolean;
  variants: Variant[];
}
