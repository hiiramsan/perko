type PrimaryAuthButtonProps = {
  label: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
};

export default function PrimaryAuthButton({
  label,
  type = 'submit',
  disabled = false,
}: PrimaryAuthButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className="w-full rounded-lg bg-[#0f172a] py-3 font-bold uppercase tracking-wider text-white transition hover:bg-[#1a1f3a] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {label}
    </button>
  );
}
