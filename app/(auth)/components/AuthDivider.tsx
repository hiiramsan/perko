type AuthDividerProps = {
  label?: string;
};

export default function AuthDivider({ label = 'O' }: AuthDividerProps) {
  return (
    <div className="my-6 flex items-center gap-4">
      <div className="h-px flex-1 bg-gray-300" />
      <span className="text-sm font-semibold text-gray-500">{label}</span>
      <div className="h-px flex-1 bg-gray-300" />
    </div>
  );
}
