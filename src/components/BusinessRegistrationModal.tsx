'use client'

import { useState, useCallback, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { memo } from 'react'
import StepTransition from './StepTransition'
import StepIndicator from './StepIndicator'
import Button from './Button'
import InputField from './InputField'
import { BusinessFormData, FieldError, WEEK_DAYS, BUSINESS_CATEGORIES } from '@/types/business'

interface BusinessRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FormWrapper = memo(({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
})

FormWrapper.displayName = 'FormWrapper'

const INITIAL_FORM_DATA: BusinessFormData = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  businessName: '',
  businessCategory: '',
  phoneNumber: '',
  website: '',
  address: '',
  city: '',
  county: '',
  eircode: '',
  openingHours: WEEK_DAYS.reduce((acc, day) => ({
    ...acc,
    [day]: { isOpen: day !== 'saturday' && day !== 'sunday', start: '09:00', end: '17:00' }
  }), {})
}

const STEP_LABELS = [
  'Personal Info',
  'Business Details',
  'Location & Hours'
]

export default function BusinessRegistrationModal({ isOpen, onClose }: BusinessRegistrationModalProps) {
  const [step, setStep] = useState<number>(1)
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')
  const [loading, setLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldError>({})
  const [formData, setFormData] = useState<BusinessFormData>(INITIAL_FORM_DATA)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    if (isOpen) {
      // When opening, we explicitly set everything to initial state
      console.log('Modal opened, setting step to 1');
      setStep(1);
      setFormData(INITIAL_FORM_DATA)
      setFieldErrors({})
      setIsSuccess(false)
      setDirection('forward')
    }
  }, [isOpen]) // Only depend on isOpen

  const handleFieldChange = useCallback((name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }, [])

  const validateSingleField = async (field: string, value: string, data: BusinessFormData): Promise<string | null> => {
    switch (field) {
      case 'email':
        if (!value) return 'Email is required'
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format'
        // Check if email exists
        try {
          const response = await fetch(`/api/check-email?email=${encodeURIComponent(value)}`)
          const result = await response.json()
          if (result.exists) return 'Email already registered'
        } catch (error) {
          console.error('Email check failed:', error)
        }
        return null

      case 'password':
        if (!value) return 'Password is required'
        if (value.length < 8) return 'Password must be at least 8 characters'
        if (!/[A-Z]/.test(value)) return 'Password must contain at least one uppercase letter'
        if (!/[a-z]/.test(value)) return 'Password must contain at least one lowercase letter'
        if (!/[0-9]/.test(value)) return 'Password must contain at least one number'
        return null

      case 'confirmPassword':
        if (value !== data.password) return 'Passwords do not match'
        return null

      case 'phoneNumber':
        if (!value) return 'Phone number is required'
        if (!/^(\+\d{1,3}[- ]?)?\d{10}$/.test(value.replace(/\s/g, ''))) {
          return 'Invalid phone number format'
        }
        return null

      case 'eircode':
        if (value && !/^[A-Z]\d{2}[A-Z0-9]{4}$/.test(value)) {
          return 'Invalid Eircode format'
        }
        return null

      default:
        if (!value && field !== 'website') return `${field} is required`
        return null
    }
  }

  const validateCurrentStep = useCallback(async () => {
    const fieldsToValidate = {
      1: ['fullName', 'email', 'password', 'confirmPassword'],
      2: ['businessName', 'businessCategory', 'phoneNumber', 'website'],
      3: ['address', 'city', 'county', 'eircode']
    }[step]

    if (!fieldsToValidate) return false

    const errors: FieldError = {}
    
    await Promise.all(
      fieldsToValidate.map(async field => {
        const error = await validateSingleField(
          field,
          formData[field as keyof BusinessFormData] as string,
          formData
        )
        if (error) errors[field] = error
      })
    )

    console.log('Validation errors:', errors)
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }, [step, formData])  


  const handleNext = async () => {
    const isValid = await validateCurrentStep()
    if (isValid) {
      setDirection('forward')
      setStep(s => Math.min(s + 1, 3))
    } else {
      toast.error('Please fix the errors before continuing')
    }
  }

  const handleBack = () => {
    setDirection('backward')
    if (step > 1) {
      setStep(s => s - 1)
    } else {
      onClose()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Submit started')
    
    if (!await validateCurrentStep()) {
      console.log('Validation failed')
      return
    }
  
    console.log('Validation passed, sending data:', formData)
    setLoading(true)
    
    try {
      const response = await fetch('/api/auth/register/business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
  
      console.log('Response received:', response)
      const data = await response.json()
      console.log('Response data:', data)
  
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }
  
      setIsSuccess(true)
      toast.success('Business registered successfully!')
      
      setTimeout(() => {
        onClose()
      }, 2000)
  
    } catch (error) {
      console.error('Registration error:', error)
      toast.error(error instanceof Error ? error.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }
// Log before rendering StepIndicator
console.log('BusinessRegistrationModal render, current step:', step);

  const renderStep1 = () => (
<div className="space-y-4">
      <InputField
        label="Full Name"
        name="fullName"
        placeholder="Your full name"
        required
        value={formData.fullName}
        onChange={handleFieldChange}
        error={fieldErrors.fullName}
      />
      <InputField
        label="Email Address"
        name="email"
        type="email"
        placeholder="your.email@example.com"
        required
        value={formData.email}
        onChange={handleFieldChange}
        error={fieldErrors.email}
      />
      <InputField
        label="Password"
        name="password"
        type="password"
        placeholder="Create a secure password"
        required
        value={formData.password}
        onChange={handleFieldChange}
        error={fieldErrors.password}
      />
      <InputField
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        placeholder="Confirm your password"
        required
        value={formData.confirmPassword}
        onChange={handleFieldChange}
        error={fieldErrors.confirmPassword}
      />
    </div>
  )

  const renderStep2 = () => (
  <div className="space-y-4">
    <InputField
      label="Business Name"
      name="businessName"
      placeholder="Your business name"
      required
      value={formData.businessName}
      onChange={handleFieldChange}
      error={fieldErrors.businessName}
    />

    <div>
      <label className="block text-[#333] font-medium mb-2">
        Business Category<span className="text-red-500 ml-1">*</span>
      </label>
      <select
        value={formData.businessCategory}
        onChange={(e) => handleFieldChange('businessCategory', e.target.value)}
        className={`
          w-full p-3 border rounded-lg text-[#333]
          ${fieldErrors.businessCategory ? 'border-red-500' : 'border-gray-300'}
        `}
        required
      >
        <option value="">Select a category</option>
        {BUSINESS_CATEGORIES.map(category => (
          <option key={category} value={category}>{category}</option>
        ))}
      </select>
      {fieldErrors.businessCategory && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-red-500"
        >
          {fieldErrors.businessCategory}
        </motion.p>
      )}
    </div>

    <InputField
      label="Phone Number"
      name="phoneNumber"
      placeholder="+353 XX XXX XXXX"
      required
      value={formData.phoneNumber}
      onChange={handleFieldChange}
      error={fieldErrors.phoneNumber}
    />

    <InputField
      label="Website (Optional)"
      name="website"
      type="url"
      placeholder="https://example.com"
      value={formData.website || ""}
      onChange={handleFieldChange}
      error={fieldErrors.website}
    />
  </div>
)


  const renderStep3 = () => (
    <div className="space-y-4">
        <InputField
          label="Business Address"
          name="address"
          placeholder="Street address"
          required
          value={formData.address}
          onChange={handleFieldChange}
          error={fieldErrors.address}
        />

        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="City"
            name="city"
            placeholder="City"
            required
            value={formData.city}
            onChange={handleFieldChange}
            error={fieldErrors.city}
          />

          <InputField
            label="County"
            name="county"
            placeholder="County"
            required
            value={formData.county}
            onChange={handleFieldChange}
            error={fieldErrors.county}
          />
        </div>

        <InputField
          label="Eircode"
          name="eircode"
          placeholder="Eircode"
          value={formData.eircode || ""}
          onChange={handleFieldChange}
          error={fieldErrors.eircode}
        />

        <div>
          <label className="block text-[#333] font-medium mb-2">
            Opening Hours
          </label>
          {WEEK_DAYS.map((day) => (
            <div key={day} className="flex items-center space-x-4 mb-2">
              <div className="w-24">
                <span className="capitalize">{day}</span>
              </div>
              <input
                type="checkbox"
                checked={formData.openingHours[day].isOpen}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    openingHours: {
                      ...formData.openingHours,
                      [day]: {
                        ...formData.openingHours[day],
                        isOpen: e.target.checked,
                      },
                    },
                  })
                }}
                className="rounded border-gray-300 text-blue-600"
              />
              {formData.openingHours[day].isOpen && (
                <div className="flex items-center space-x-2">
                  <input
                    type="time"
                    value={formData.openingHours[day].start}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        openingHours: {
                          ...formData.openingHours,
                          [day]: {
                            ...formData.openingHours[day],
                            start: e.target.value,
                          },
                        },
                      })
                    }}
                    className="p-2 border border-gray-300 rounded"
                  />
                  <span>to</span>
                  <input
                    type="time"
                    value={formData.openingHours[day].end}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        openingHours: {
                          ...formData.openingHours,
                          [day]: {
                            ...formData.openingHours[day],
                            end: e.target.value,
                          },
                        },
                      })
                    }}
                    className="p-2 border border-gray-300 rounded"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg p-8 max-w-2xl w-full m-4 relative"
      >
        {isSuccess ? (  
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 mx-auto mb-4 text-green-500"><svg className="w-full h-full" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </motion.div>
          <h3 className="text-xl font-bold mb-2">Registration Successful!</h3>
          <p className="text-gray-600">Your business has been registered successfully.</p>
        </motion.div>
      ) : (
        <>
          <div className="mb-8">
            <StepIndicator 
              key={`step-indicator-${step}`}
              currentStep={step} 
              totalSteps={3} 
              labels={STEP_LABELS} 
            />
          </div>
          <FormWrapper>
            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence mode="wait" initial={false}>
                <StepTransition key={step} direction={direction}>
                  {(() => {
                    switch (step) {
                      case 1:
                        return renderStep1()
                      case 2:
                        return renderStep2()
                      case 3:
                        return renderStep3()
                      default:
                        return renderStep1()
                    }
                  })()}
                </StepTransition>
              </AnimatePresence>

              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                >
                  {step === 1 ? 'Cancel' : '← Back'}
                </Button>

                <Button
                  type={step === 3 ? 'submit' : 'button'}
                  variant="primary"
                  onClick={step === 3 ? undefined : handleNext}
                  isLoading={loading}
                >
                  {step === 3 ? 'Complete Registration' : 'Next →'}
                </Button>
              </div>
            </form>
          </FormWrapper>
        </>
      )}
    </motion.div>
  </div>
);
}