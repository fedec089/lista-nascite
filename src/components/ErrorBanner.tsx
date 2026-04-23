interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-rose-200 bg-rose-50/80 p-5 text-center shadow-card">
      <p className="text-2xl" aria-hidden>⚠️</p>
      <p className="mt-2 font-display text-lg font-700 text-rose-700">
        Qualcosa è andato storto
      </p>
      <p className="mt-1 text-sm text-rose-600">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-full bg-rose-500 px-5 py-2 text-sm font-bold text-white shadow-card transition hover:brightness-110"
        >
          Riprova
        </button>
      )}
    </div>
  );
}
