export interface OrderItemDto {
    id: number;
    name: string;
    size: string;
    price: number;
    quantity: number;
    addOns?: string[];
    addOnQuantity?: number;
}