export function Loader({ label = "Loading..." }: { label?: string }) {
  return (
    <div
      role="status"
      className="flex flex-col items-center justify-center gap-3 py-24 text-slate-400"
    >
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-amber-400" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
