import { ChangeEventHandler, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

type PasswordFieldProps = {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  required?: boolean;
  autoComplete?: string;
};

export default function PasswordField({
  id,
  label,
  placeholder,
  value,
  onChange,
  required = false,
  autoComplete,
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-xs font-semibold uppercase text-[#0f172a]">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#2f6a4f]"
          required={required}
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1.5 text-[#0f172a] transition hover:text-[#ef4f2f]"
          aria-label={showPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}
