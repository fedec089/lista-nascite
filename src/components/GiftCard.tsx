import type { Gift } from '../types';

interface GiftCardProps {
  gift: Gift;
  onSelect: (gift: Gift) => void;
  adminMode?: boolean;
  onFree?: (gift: Gift) => void;
  disabled?: boolean;
}

export function GiftCard({ gift, onSelect, adminMode, onFree, disabled }: GiftCardProps) {
  if (gift.presoDa) {
    return <TakenRow gift={gift} adminMode={adminMode} onFree={onFree} />;
  }
  return <AvailableCard gift={gift} onSelect={onSelect} disabled={disabled} />;
}

function AvailableCard({
  gift,
  onSelect,
  disabled,
}: {
  gift: Gift;
  onSelect: (gift: Gift) => void;
  disabled?: boolean;
}) {
  return (
    <article className="group relative keepsake flex flex-col gap-4 p-5 transition-colors duration-200 hover:border-ink/25 sm:p-6">
      {gift.priorita && (
        <span
          className="absolute -top-2 right-5 inline-flex items-center gap-1 rounded-full bg-honey-surface px-3 py-1 text-[11px] font-semibold uppercase tracking-label text-ink"
          title="Regalo prioritario"
        >
          <span aria-hidden className="text-ink">✶</span> Importante
        </span>
      )}

      <header className="pr-2">
        <h3 className="font-display text-xl leading-[1.15] text-ink sm:text-2xl">
          {gift.nome || 'Senza nome'}
        </h3>
        {gift.dettaglio && (
          <p className="mt-1 text-sm text-ink-muted">{gift.dettaglio}</p>
        )}
      </header>

      {gift.note && (
        <p className="border-t border-hairline pt-3 text-[0.8125rem] italic leading-relaxed text-ink-muted">
          {gift.note}
        </p>
      )}

      <div className="mt-auto flex items-center justify-end">
        <button
          type="button"
          disabled={disabled}
          onClick={() => onSelect(gift)}
          className="inline-flex items-center gap-2 rounded-full bg-sky px-5 py-2.5 font-body text-[0.8125rem] font-semibold tracking-wide text-white shadow-sm transition hover:bg-sky-strong active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          Lo prendo io
          <span aria-hidden>→</span>
        </button>
      </div>
    </article>
  );
}

function TakenRow({
  gift,
  adminMode,
  onFree,
}: {
  gift: Gift;
  adminMode?: boolean;
  onFree?: (gift: Gift) => void;
}) {
  return (
    <article className="group flex items-baseline gap-4 border-b border-hairline py-4">
      <span
        aria-hidden
        className="shrink-0 translate-y-[1px] font-display text-sm text-ink-soft"
      >
        ✓
      </span>

      <div className="min-w-0 flex-1">
        <h3 className="font-display text-lg leading-snug text-ink-soft line-through decoration-[1px] decoration-ink-soft/50 sm:text-xl">
          {gift.nome || 'Senza nome'}
        </h3>
        <p className="mt-0.5 text-[0.8125rem] text-ink-muted">
          {gift.dettaglio && <span className="line-through decoration-ink-muted/40">{gift.dettaglio} · </span>}
          scelto da <span className="font-semibold text-ink">{gift.presoDa}</span>
        </p>
      </div>

      {adminMode && onFree && (
        <button
          type="button"
          onClick={() => onFree(gift)}
          className="shrink-0 text-[0.75rem] font-semibold uppercase tracking-label text-ink-muted underline-offset-4 transition hover:text-ink hover:underline"
        >
          Libera
        </button>
      )}
    </article>
  );
}
