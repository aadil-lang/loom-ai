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
}
