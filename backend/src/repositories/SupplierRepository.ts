import { Supplier, ISupplier } from '../models/Supplier';
import { BaseRepository } from './BaseRepository';

export class SupplierRepository extends BaseRepository<ISupplier> {
  constructor() {
    super(Supplier);
  }

  async findByEmail(email: string): Promise<ISupplier | null> {
    return await this.model.findOne({ email }).exec();
  }
}
