export interface UpdateSupplierProfileDto {
  name?: string;
  contactName?: string;
  location?: string;
  companyDescription?: string;
  operatingRegions?: string[];
  businessHours?: string;
  capabilities?: string[];
  certifications?: string[];
}

export interface UpdateBusinessSettingsDto {
  currency?: string;
  timeZone?: string;
  languagePreference?: string;
  notificationPreferences?: Record<string, boolean>;
}
