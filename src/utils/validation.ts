import { BusinessRegistrationData, ValidationErrors } from '@/types/forms'

export const validateStep1 = (data: Partial<BusinessRegistrationData>): ValidationErrors => {
  const errors: ValidationErrors = {}

  if (!data.fullName?.trim()) {
    errors.fullName = 'Full name is required'
  }

  if (!data.email?.trim()) {
    errors.email = 'Email is required'
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = 'Please enter a valid email'
  }

  if (!data.password?.trim()) {
    errors.password = 'Password is required'
  } else if (data.password.length < 8) {
    errors.password = 'Password must be at least 8 characters'
  }

  if (!data.confirmPassword?.trim()) {
    errors.confirmPassword = 'Please confirm your password'
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
  }

  return errors
}

export const validateStep2 = (data: Partial<BusinessRegistrationData>): ValidationErrors => {
  const errors: ValidationErrors = {}

  if (!data.businessName?.trim()) {
    errors.businessName = 'Business name is required'
  }

  if (!data.businessCategory?.trim()) {
    errors.businessCategory = 'Please select a business category'
  }

  if (!data.phoneNumber?.trim()) {
    errors.phoneNumber = 'Phone number is required'
  } else if (!/^\+?[\d\s-]{10,}$/.test(data.phoneNumber)) {
    errors.phoneNumber = 'Please enter a valid phone number'
  }

  if (data.website && !/^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/.test(data.website)) {
    errors.website = 'Please enter a valid website URL'
  }

  return errors
}

export const validateStep3 = (data: Partial<BusinessRegistrationData>): ValidationErrors => {
  const errors: ValidationErrors = {}

  if (!data.address?.trim()) {
    errors.address = 'Address is required'
  }

  if (!data.city?.trim()) {
    errors.city = 'City is required'
  }

  if (!data.county?.trim()) {
    errors.county = 'County is required'
  }

  return errors
}