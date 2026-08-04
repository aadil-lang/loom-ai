export interface UpdateProfileDto {
  name?: string;
  contactName?: string;
  phone?: string;
  sourcingPreferences?: string[];
  preferredCategories?: string[];
  preferredMaterials?: string[];
  budgetRange?: string;
  preferredLanguage?: string;
}
