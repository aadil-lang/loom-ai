export interface ProductQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  colors?: string; // Comma separated
  fabricType?: string;
  supplier?: string;
  weaveType?: string;
  industryApplications?: string;
  sustainabilityRating?: string;
  sortBy?: 'newest' | 'price_asc' | 'price_desc' | 'popular' | 'trending';
}
