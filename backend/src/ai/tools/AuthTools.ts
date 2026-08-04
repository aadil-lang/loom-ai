import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { SupplierRepository } from '../../repositories/SupplierRepository';

export class AuthTools {
  private supplierRepository = new SupplierRepository();

  public getCheckEmailTool() {
    return new DynamicStructuredTool({
      name: 'check_email_exists',
      description: 'Check if an email address is already registered in the system.',
      schema: z.object({
        email: z.string().email(),
      }),
      func: async ({ email }) => {
        try {
          const exists = await this.supplierRepository.findByEmail(email);
          return exists ? JSON.stringify({ exists: true }) : JSON.stringify({ exists: false });
        } catch (error: any) {
          return `Error checking email: ${error.message}`;
        }
      }
    });
  }
}
