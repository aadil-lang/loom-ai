export interface RegisterBuyerDto {
  name: string;
  email: string;
  password: string;
  contactName: string;
  phone?: string;
  sourcingPreferences?: string[];
}
