export interface CheckoutDto {
  shippingAddressId: string;
  billingAddressId?: string; // Optional if same as shipping
}
