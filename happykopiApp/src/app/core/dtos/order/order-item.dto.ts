export interface Addon {
  name: string;
  quantity: number;
  price: number;
}

export interface OrderItem {
  tempOrderID: number;
  drinkID?: number;
  drinkName: string;
  drinkCategory: string;
  size: string;
  quantity: number;
  total: number;
  addons: Addon[];
}
