interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  return (
    <div className="keepsake mx-auto max-w-xl p-6 sm:p-7">
      <p className="u-eyebrow text-ink">Qualcosa non ha funzionato</p>
      <p className="mt-3 font-display text-xl leading-snug text-ink sm:text-2xl">
        Non siamo riusciti a caricare la lista.
      </p>
      <p className="mt-2 text-sm text-ink-muted">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-sky px-5 py-2.5 text-[0.8125rem] font-semibold tracking-wide text-white shadow-sm transition hover:bg-sky-strong"
        >
          Riprova
          <span aria-hidden>↻</span>
        </button>
      )}
    </div>
  );
}
