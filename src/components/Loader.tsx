export function Loader() {
  return (
    <div className="flex flex-col items-start gap-4 py-12">
      <div className="flex items-center gap-3">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-hairline border-t-ink" />
        <span className="u-eyebrow">Caricamento lista</span>
      </div>
      <div className="flex w-full flex-col gap-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="keepsake h-24 animate-pulse opacity-60"
            style={{ animationDelay: `${i * 120}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
