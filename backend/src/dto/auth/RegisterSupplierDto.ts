export interface RegisterSupplierDto {
  name: string;
  email: string;
  password: string;
  contactName: string;
  location: string;
  certifications?: string[];
  capabilities?: string[];
}
