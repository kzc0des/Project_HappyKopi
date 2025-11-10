export interface CartAddonDto {
  name: string;
  quantity: number;
}

export interface cartItemDto {
  Name: string;
  Size: string;
  DrinkImage: string;
  Addons: CartAddonDto[];
  Subtotal: number;
  DrinkQuantity: number; 
}