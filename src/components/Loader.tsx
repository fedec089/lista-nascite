export function Loader() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-sky-deep">
      <div className="relative h-14 w-14">
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-sky-powder border-t-sky-deep" />
        <span className="absolute inset-0 flex items-center justify-center text-xl" aria-hidden>
          🍼
        </span>
      </div>
      <p className="font-display text-sm font-600 tracking-wide text-slate-500">
        Carico la lista regali…
      </p>
    </div>
  );
}
