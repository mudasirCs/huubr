export interface BusinessFormData {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    businessName: string;
    businessCategory: string;
    phoneNumber: string;
    website?: string;
    address: string;
    city: string;
    county: string;
    eircode?: string;
    openingHours: {
      [key: string]: {
        isOpen: boolean;
        start?: string;
        end?: string;
      };
    };
  }
  
  export interface ValidationError {
    field: string;
    message: string;
  }
  
  export interface FieldError {
    [key: string]: string;
  }
  
  export const WEEK_DAYS = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday'
  ] as const;
  
  export const BUSINESS_CATEGORIES = [
    'Restaurants & Catering',
    'Retail',
    'Professional Services',
    'Health & Wellness',
    'Technology',
    'Beauty & Personal Care',
    'Education & Training',
    'Home Services',
    'Automotive',
    'Entertainment'
  ] as const;
  
  export type WeekDay = typeof WEEK_DAYS[number];
  export type BusinessCategory = typeof BUSINESS_CATEGORIES[number];