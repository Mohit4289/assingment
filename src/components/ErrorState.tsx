export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-4 rounded-xl border border-red-900/50 bg-red-950/30 py-16 px-6 text-center"
    >
      <p className="text-lg font-medium text-red-300">Something went wrong</p>
      <p className="max-w-md text-sm text-red-200/80">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-lg bg-red-500/90 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
      >
        Try again
      </button>
    </div>
  );
}
