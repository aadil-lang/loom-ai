import { BuyerRepository } from '../../repositories/BuyerRepository';
import { IBuyer } from '../../models/Buyer';
import { UpdateProfileDto } from '../../dto/buyer/UpdateProfileDto';
import { NotFoundError } from '../../errors/CustomErrors';

export class BuyerProfileService {
  private buyerRepository: BuyerRepository;

  constructor() {
    this.buyerRepository = new BuyerRepository();
  }

  async getProfile(buyerId: string): Promise<IBuyer> {
    const profile = await this.buyerRepository.findById(buyerId);
    if (!profile) throw new NotFoundError('Buyer profile not found');
    return profile;
  }

  async updateProfile(buyerId: string, dto: UpdateProfileDto): Promise<IBuyer> {
    const updated = await this.buyerRepository.update(buyerId, dto as any);
    if (!updated) throw new NotFoundError('Buyer profile not found');
    return updated;
  }
}
