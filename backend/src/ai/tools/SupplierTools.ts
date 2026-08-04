import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { SupplierProfileService } from '../../services/supplier/SupplierProfileService';
import { InventoryService } from '../../services/supplier/InventoryService';

export class SupplierTools {
  private profileService = new SupplierProfileService();
  private inventoryService = new InventoryService();

  /**
   * Note: AI Tools must accept a supplierId parameter because agents act on behalf of a specific user.
   * In a real agent graph, the supplierId would be extracted from the authenticated request state and injected.
   */
  public getSupplierProfileTool() {
    return new DynamicStructuredTool({
      name: 'get_supplier_profile',
      description: 'Retrieve the business profile and settings for a specific supplier.',
      schema: z.object({
        supplierId: z.string().describe('The ID of the supplier'),
      }),
      func: async ({ supplierId }) => {
        try {
          const profile = await this.profileService.getProfile(supplierId);
          return JSON.stringify(profile);
        } catch (error: any) {
          return `Error retrieving supplier profile: ${error.message}`;
        }
      }
    });
  }

  public getUpdateInventoryTool() {
    return new DynamicStructuredTool({
      name: 'update_inventory',
      description: 'Update the stock status of a specific product for a supplier.',
      schema: z.object({
        supplierId: z.string().describe('The ID of the supplier making the request'),
        productId: z.string().describe('The ID of the product to update'),
        inStock: z.boolean().describe('Whether the product is currently in stock'),
      }),
      func: async ({ supplierId, productId, inStock }) => {
        try {
          const result = await this.inventoryService.updateInventory(supplierId, productId, { inStock });
          return JSON.stringify(result);
        } catch (error: any) {
          return `Error updating inventory: ${error.message}`;
        }
      }
    });
  }

  public getSearchSuppliersTool() {
    return new DynamicStructuredTool({
      name: 'search_suppliers',
      description: 'Search for suppliers based on criteria like capabilities or location.',
      schema: z.object({
        query: z.string().optional().describe('Search keyword'),
        limit: z.number().optional().default(5)
      }),
      func: async ({ query, limit }) => {
        try {
          // This uses the profile service internally or could use repository. 
          // For now, we will return a mock or call a real method if it exists.
          // In a real app we'd have supplierService.searchSuppliers()
          return JSON.stringify([{ id: 'mock-supplier', note: 'Supplier search API integration pending' }]);
        } catch (error: any) {
          return `Error searching suppliers: ${error.message}`;
        }
      }
    });
  }
}
