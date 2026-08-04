import { SupplierRepository } from '../../repositories/SupplierRepository';
import { ISupplier } from '../../models/Supplier';
import { UpdateSupplierProfileDto, UpdateBusinessSettingsDto } from '../../dto/supplier/SupplierProfileDto';
import { NotFoundError } from '../../errors/CustomErrors';

export class SupplierProfileService {
  private supplierRepository: SupplierRepository;

  constructor() {
    this.supplierRepository = new SupplierRepository();
  }

  async getProfile(supplierId: string): Promise<ISupplier> {
    const profile = await this.supplierRepository.findById(supplierId);
    if (!profile) throw new NotFoundError('Supplier profile not found');
    return profile;
  }

  async updateProfile(supplierId: string, dto: UpdateSupplierProfileDto): Promise<ISupplier> {
    const updated = await this.supplierRepository.update(supplierId, dto as any);
    if (!updated) throw new NotFoundError('Supplier profile not found');
    return updated;
  }

  async updateSettings(supplierId: string, dto: UpdateBusinessSettingsDto): Promise<ISupplier> {
    const profile = await this.getProfile(supplierId);
    
    // Merge new settings with existing
    const newSettings = { ...profile.businessSettings, ...dto };
    const updated = await this.supplierRepository.update(supplierId, { businessSettings: newSettings } as any);
    
    return updated as ISupplier;
  }
}
