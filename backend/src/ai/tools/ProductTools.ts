import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { ProductService } from '../../services/ProductService';
import mongoose from 'mongoose';

export class ProductTools {
  private productService = new ProductService();

  public getSearchProductsTool() {
    return new DynamicStructuredTool({
      name: 'search_products',
      description: 'Search the Marketplace for textile products based on query, categories, and price.',
      schema: z.object({
        query: z.string().optional().describe('Search keyword like "cotton" or "silk"'),
        category: z.string().optional().describe('Category name to filter by'),
        minPrice: z.number().optional().describe('Minimum price per meter'),
        maxPrice: z.number().optional().describe('Maximum price per meter'),
        limit: z.number().optional().default(10),
      }),
      func: async ({ query, category, minPrice, maxPrice, limit }) => {
        try {
          const results = await this.productService.searchProducts({ search: query, category, minPrice, maxPrice, limit, page: 1, sortBy: 'newest' });
          return JSON.stringify(results.data);
        } catch (error: any) {
          return `Error searching products: ${error.message}`;
        }
      }
    });
  }

  public getProductDetailsTool() {
    return new DynamicStructuredTool({
      name: 'get_product_details',
      description: 'Retrieve detailed information for a specific product including supplier info and certifications.',
      schema: z.object({
        productId: z.string().describe('The ID of the product'),
      }),
      func: async ({ productId }) => {
        try {
          if (!mongoose.Types.ObjectId.isValid(productId)) {
            return `Error: Invalid product ID format`;
          }
          const product = await this.productService.getProductDetails(productId);
          return JSON.stringify(product);
        } catch (error: any) {
          return `Error retrieving product details: ${error.message}`;
        }
      }
    });
  }
}
