interface HeaderProps {
  disponibili: number;
  totali: number;
  onTitleClick: () => void;
  adminMode: boolean;
}

export function Header({ disponibili, totali, onTitleClick, adminMode }: HeaderProps) {
  const presi = Math.max(0, totali - disponibili);

  return (
    <header className="relative">
      <div className="mx-auto max-w-3xl px-6 pt-10 pb-10 sm:pt-16 sm:pb-14">
        <div className="flex items-center justify-between">
          <span className="u-eyebrow inline-flex items-center gap-2">
            Lista nascita
            <span aria-hidden className="text-base tracking-normal">🍼 ⭐ 🐻</span>
          </span>
          {adminMode && (
            <span className="inline-flex items-center gap-2 rounded-full border border-hairline bg-honey-surface px-3 py-1 text-[11px] font-semibold uppercase tracking-label text-ink-muted animate-fade-in">
              <span className="h-1.5 w-1.5 rounded-full bg-honey" /> Admin
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={onTitleClick}
          aria-label="Nome"
          className="mt-6 block select-none text-left transition active:opacity-80"
        >
          <h1 className="u-hero">Marco</h1>
        </button>

        <p className="mt-6 max-w-md font-body text-base leading-relaxed text-ink-muted sm:text-lg">
          Questa è la nostra lista nascita. Scegli un regalo — scrivi il tuo nome e
          sarà <em className="not-italic text-ink">custodito</em> per lui.
        </p>

        <div className="mt-8 flex flex-wrap items-baseline gap-x-6 gap-y-3 border-t border-hairline pt-5">
          <Counter value={disponibili} label={disponibili === 1 ? 'disponibile' : 'disponibili'} emphasis />
          <Counter value={presi} label={presi === 1 ? 'già scelto' : 'già scelti'} />
          <Counter value={totali} label={totali === 1 ? 'regalo totale' : 'regali totali'} />
        </div>
      </div>
    </header>
  );
}

function Counter({
  value,
  label,
  emphasis = false,
}: {
  value: number;
  label: string;
  emphasis?: boolean;
}) {
  return (
    <div className="flex items-baseline gap-2">
      <span
        className={[
          'font-display tabular-nums leading-none',
          emphasis ? 'text-3xl text-ink sm:text-4xl' : 'text-xl text-ink-soft sm:text-2xl',
        ].join(' ')}
      >
        {value}
      </span>
      <span className="u-eyebrow !text-[0.65rem] !tracking-[0.16em]">{label}</span>
    </div>
  );
}
