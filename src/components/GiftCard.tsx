import type { Gift } from '../types';

interface GiftCardProps {
  gift: Gift;
  onSelect: (gift: Gift) => void;
  adminMode?: boolean;
  onFree?: (gift: Gift) => void;
  disabled?: boolean;
}

export function GiftCard({ gift, onSelect, adminMode, onFree, disabled }: GiftCardProps) {
  const taken = Boolean(gift.presoDa);

  return (
    <article
      className={[
        'group relative soft-card p-5 transition-all duration-300',
        taken
          ? 'opacity-60 saturate-50'
          : 'hover:-translate-y-1 hover:shadow-lift hover:bg-white',
      ].join(' ')}
    >
      {gift.priorita && !taken && (
        <div className="absolute -top-[-5px] right-[5px] inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-honey to-[#f0a84d] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-md">
          <span aria-hidden>⭐</span> Importante
        </div>
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3
            className={[
              'font-display text-xl font-700 text-slate-800 sm:text-2xl',
              taken ? 'line-through decoration-slate-400 decoration-2' : '',
            ].join(' ')}
          >
            {gift.nome || 'Senza nome'}
          </h3>

          {gift.dettaglio && (
            <p
              className={[
                'mt-1 text-sm text-slate-600',
                taken ? 'line-through decoration-slate-400/70' : '',
              ].join(' ')}
            >
              {gift.dettaglio}
            </p>
          )}

          {gift.note && (
            <p className="mt-2 rounded-xl bg-sky-powder/50 px-3 py-2 text-xs italic text-slate-600">
              💭 {gift.note}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        {taken ? (
          <div className="flex min-w-0 flex-1 items-center gap-2 text-sm text-slate-500">
            <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-powder text-sky-deep">
              ✓
            </span>
            <span className="truncate">
              Scelto da <span className="font-semibold text-slate-700">{gift.presoDa}</span>
            </span>
          </div>
        ) : (
          <button
            type="button"
            disabled={disabled}
            onClick={() => onSelect(gift)}
            className="inline-flex items-center gap-2 rounded-full bg-sky-deep px-4 py-2 text-sm font-bold text-white shadow-card transition hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Lo prendo io <span aria-hidden>💛</span>
          </button>
        )}

        {adminMode && taken && onFree && (
          <button
            type="button"
            onClick={() => onFree(gift)}
            className="rounded-full border border-rose-200 bg-white/80 px-3 py-1.5 text-xs font-semibold text-rose-500 transition hover:bg-rose-50"
          >
            Libera regalo
          </button>
        )}
      </div>
    </article>
  );
}
