export interface CreateAddressDto {
  title: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  type: 'Billing' | 'Shipping';
  isDefault?: boolean;
}

export interface UpdateAddressDto extends Partial<CreateAddressDto> {}
