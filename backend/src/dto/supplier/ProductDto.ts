export interface CreateProductDto {
  categoryId: string;
  name: string;
  sku: string;
  description: string;
  pricePerMeter: number;
  moq: number;
  composition: string;
  weightGSM: number;
  width: string;
  fabricType: string;
  colors?: string[];
  tags?: string[];
  certifications?: string[];
  inStock?: boolean;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {
  productStatus?: 'active' | 'draft' | 'archived';
  isFeatured?: boolean;
}

export interface ReorderImagesDto {
  images: string[];
}
