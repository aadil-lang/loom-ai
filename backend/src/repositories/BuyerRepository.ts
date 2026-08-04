import { Buyer, IBuyer } from '../models/Buyer';
import { BaseRepository } from './BaseRepository';

export class BuyerRepository extends BaseRepository<IBuyer> {
  constructor() {
    super(Buyer);
  }

  async findByEmail(email: string): Promise<IBuyer | null> {
    return await this.model.findOne({ email }).exec();
  }
}
