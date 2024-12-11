export interface BusinessRegistrationData {
    // Step 1: Owner Information
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
  
    // Step 2: Business Information
    businessName: string;
    businessCategory: string;
    phoneNumber: string;
    website?: string;
  
    // Step 3: Location & Hours
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
  
  export interface ValidationErrors {
    [key: string]: string;
  }