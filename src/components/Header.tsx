interface HeaderProps {
  disponibili: number;
  totali: number;
  onTitleClick: () => void;
  adminMode: boolean;
}

export function Header({ disponibili, totali, onTitleClick, adminMode }: HeaderProps) {
  return (
    <header className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-16 -left-10 h-64 w-64 rounded-full bg-sky-powder/70 blur-3xl" />
        <div className="absolute -top-10 right-0 h-48 w-48 rounded-full bg-honey/30 blur-3xl" />
        <div className="absolute top-20 right-20 h-40 w-40 rounded-full bg-blush/40 blur-3xl" />
      </div>

      <div className="mx-auto max-w-3xl px-5 pt-12 pb-8 text-center sm:pt-16">
        <div className="mb-3 flex items-center justify-center gap-2 text-2xl">
          <span className="animate-float" aria-hidden>🍼</span>
          <span className="animate-float" style={{ animationDelay: '0.6s' }} aria-hidden>⭐</span>
          <span className="animate-float" style={{ animationDelay: '1.2s' }} aria-hidden>🐻</span>
        </div>

        <button
          onClick={onTitleClick}
          className="group block w-full select-none rounded-3xl px-3 py-2 transition"
          aria-label="Titolo"
        >
          <p className="font-display text-sm font-semibold uppercase tracking-[0.25em] text-sky-deep/80">
            Lista Nascita di
          </p>
          <h1 className="font-display text-6xl font-800 leading-none text-sky-deep drop-shadow-sm sm:text-7xl">
            <span className="bg-gradient-to-br from-sky-deep via-sky-deep to-[#4a8dad] bg-clip-text text-transparent">
              Marco
            </span>
          </h1>
        </button>

        <p className="mx-auto mt-4 max-w-md font-body text-base text-slate-600 sm:text-lg">
          Aiutaci ad accoglierlo nel mondo <span aria-hidden>💛</span>
        </p>

        <div className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full border border-white bg-white/70 px-4 py-2 text-sm font-semibold text-sky-deep shadow-card backdrop-blur">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-deep opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-deep" />
          </span>
          {disponibili} {disponibili === 1 ? 'regalo' : 'regali'} ancora disponibili
          {totali > 0 && (
            <span className="text-slate-400">· {totali} totali</span>
          )}
        </div>

        {adminMode && (
          <div className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full bg-honey/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-700 animate-fade-in">
            <span aria-hidden>🔧</span> Modalità admin attiva
          </div>
        )}
      </div>
    </header>
  );
}
