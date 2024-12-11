interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline'
    isLoading?: boolean
  }
  
  export default function Button({ 
    children, 
    variant = 'primary', 
    isLoading, 
    className = '', 
    disabled, 
    ...props 
  }: ButtonProps) {
    const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-colors duration-200'
    
    const variants = {
      primary: 'bg-[#A4C639] text-white hover:bg-[#93B233] disabled:bg-gray-300',
      secondary: 'bg-[#FF4D00] text-white hover:bg-[#E64500] disabled:bg-gray-300',
      outline: 'border border-[#A4C639] text-[#A4C639] hover:bg-[#A4C639] hover:text-white',
    }
  
    return (
      <button
        className={`
          ${baseClasses}
          ${variants[variant]}
          ${className}
          ${disabled || isLoading ? 'cursor-not-allowed opacity-70' : ''}
        `}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Loading...
          </span>
        ) : children}
      </button>
    )
  }