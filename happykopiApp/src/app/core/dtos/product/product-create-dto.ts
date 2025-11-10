import { ProductVariantCreateDto } from "./product-variant-create-dto";

export interface ProductCreateDto {
    name: string;
    description?: string; 
    imageFile?: File | null;  
    categoryId: number;
    isAvailable: boolean;
    isActive: boolean;
    variants: ProductVariantCreateDto[];
}
