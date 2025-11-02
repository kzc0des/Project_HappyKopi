import { ProductVariantCreateDto } from "./product-variant-create-dto";

export interface ProductCreateDto {
    name: string;
    description?: string; 
    imageUrl?: string;  
    categoryId: number;
    isAvailable: boolean;
    isActive: boolean;
    variants: ProductVariantCreateDto[];
}
