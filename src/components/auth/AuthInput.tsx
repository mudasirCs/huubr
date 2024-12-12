import { FieldValues, UseFormRegister, Path } from 'react-hook-form'

interface AuthInputProps<T extends FieldValues> {
id: Path<T>;
label: string;
type?: string;
register: UseFormRegister<T>;
error?: string;
placeholder?: string;
autoComplete?: string;
}


export function AuthInput<T extends FieldValues>({
  id,
  label,
  type = 'text',
  register,
  error,
  placeholder,
  autoComplete,
}: AuthInputProps<T>) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        {...register(id)}
        type={type}
        id={id}
        autoComplete={autoComplete}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
        placeholder={placeholder}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}