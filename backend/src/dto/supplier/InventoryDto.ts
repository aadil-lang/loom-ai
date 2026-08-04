export interface UpdateInventoryDto {
  inStock: boolean;
  // Further fields could include exact quantity if implemented later
}

export interface BulkInventoryDto {
  updates: {
    productId: string;
    inStock: boolean;
  }[];
}
