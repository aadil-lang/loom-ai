import { AddressRepository } from '../../repositories/AddressRepository';
import { IAddress } from '../../models/Address';
import mongoose from 'mongoose';
import { CreateAddressDto, UpdateAddressDto } from '../../dto/buyer/AddressDto';
import { NotFoundError, ForbiddenError } from '../../errors/CustomErrors';

export class AddressService {
  private addressRepository: AddressRepository;

  constructor() {
    this.addressRepository = new AddressRepository();
  }

  async getAddresses(buyerId: string): Promise<IAddress[]> {
    return await this.addressRepository.findByBuyer(buyerId);
  }

  async createAddress(buyerId: string, dto: CreateAddressDto): Promise<IAddress> {
    if (dto.isDefault) {
      await this.addressRepository.unsetDefaultForBuyer(buyerId, dto.type);
    }
    return await this.addressRepository.create({ ...dto, buyerId: new mongoose.Types.ObjectId(buyerId) } as any);
  }

  async updateAddress(buyerId: string, addressId: string, dto: UpdateAddressDto): Promise<IAddress> {
    const address = await this.addressRepository.findById(addressId);
    if (!address) throw new NotFoundError('Address not found');
    if (address.buyerId.toString() !== buyerId) throw new ForbiddenError('Access denied to this address');

    if (dto.isDefault && dto.type) {
      await this.addressRepository.unsetDefaultForBuyer(buyerId, dto.type);
    } else if (dto.isDefault) {
      await this.addressRepository.unsetDefaultForBuyer(buyerId, address.type);
    }

    const updated = await this.addressRepository.update(addressId, dto);
    return updated as IAddress;
  }

  async deleteAddress(buyerId: string, addressId: string): Promise<void> {
    const address = await this.addressRepository.findById(addressId);
    if (!address) throw new NotFoundError('Address not found');
    if (address.buyerId.toString() !== buyerId) throw new ForbiddenError('Access denied to this address');

    await this.addressRepository.delete(addressId);
  }
}
