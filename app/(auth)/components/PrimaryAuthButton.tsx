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
      className="w-full rounded-lg cursor-pointer bg-[#05668D] py-3 font-bold uppercase tracking-wider text-white transition hover:bg-[#264653] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {label}
    </button>
  );
}