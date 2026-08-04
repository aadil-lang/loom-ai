import { Address, IAddress } from '../models/Address';
import { BaseRepository } from './BaseRepository';

export class AddressRepository extends BaseRepository<IAddress> {
  constructor() {
    super(Address);
  }

  async findByBuyer(buyerId: string): Promise<IAddress[]> {
    return await this.model.find({ buyerId }).exec();
  }

  async unsetDefaultForBuyer(buyerId: string, type: 'Billing' | 'Shipping'): Promise<void> {
    await this.model.updateMany({ buyerId, type }, { $set: { isDefault: false } }).exec();
  }
}
