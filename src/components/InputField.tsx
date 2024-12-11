// src/components/InputField.tsx

interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  value?: string;
  error?: string;
  placeholder?: string;
  onChange: (name: string, value: string) => void;
}

export default function InputField({
  label,
  name,
  type = 'text',
  required = false,
  value = '',
  error,
  placeholder,
  onChange
}: InputFieldProps) {
  return (
    <div>
      <label className="block text-[#333] font-medium mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          className={`
            w-full p-3 border rounded-lg text-[#333]
            ${error ? 'border-red-500' : 'border-gray-300'}
            transition-colors duration-200
          `}
          placeholder={placeholder}
          required={required}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  )
}