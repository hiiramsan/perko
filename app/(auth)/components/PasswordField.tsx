'use client';

type ChangeHandler = (event: { target: HTMLInputElement }) => void;

type PasswordFieldProps = {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: ChangeHandler;
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
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-xs font-semibold uppercase text-[#0f172a]">
        {label}
      </label>
      <input
        id={id}
        type="password"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        className="w-full rounded-lg border border-gray-300 px-4 py-3 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#2f6a4f]"
        required={required}
      />
    </div>
  );
}