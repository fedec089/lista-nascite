import { useEffect, useRef, useState } from 'react';
import type { Gift } from '../types';

interface ClaimModalProps {
  gift: Gift;
  onClose: () => void;
  onConfirm: (name: string) => Promise<void>;
}

export function ClaimModal({ gift, onClose, onConfirm }: ClaimModalProps) {
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !submitting) onClose();
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose, submitting]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Inserisci il tuo nome');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await onConfirm(trimmed);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore durante il salvataggio');
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 pt-8 sm:items-center sm:pt-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="claim-modal-title"
    >
      <button
        type="button"
        aria-label="Chiudi"
        onClick={() => !submitting && onClose()}
        className="absolute inset-0 bg-ink/35 backdrop-blur-[2px] animate-fade-in"
      />

      <div className="keepsake relative w-full max-w-md animate-panel-in p-6 sm:p-8">
        <p className="u-eyebrow">Stai scegliendo</p>
        <h2 id="claim-modal-title" className="mt-2 font-display text-3xl leading-tight text-ink sm:text-4xl">
          {gift.nome}
        </h2>
        {gift.dettaglio && (
          <p className="mt-1.5 text-sm text-ink-muted">{gift.dettaglio}</p>
        )}

        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          <label className="block">
            <span className="u-eyebrow mb-2 block">Il tuo nome</span>
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Es. Zia Giulia"
              disabled={submitting}
              maxLength={80}
              autoComplete="name"
              className="w-full border-b border-ink/20 bg-transparent px-0 py-3 font-display text-2xl text-ink placeholder:font-body placeholder:text-base placeholder:text-ink-soft/60 focus:border-ink focus:outline-none disabled:opacity-50"
            />
          </label>

          <p className="text-[0.8125rem] leading-relaxed text-ink-muted">
            Il tuo nome apparirà accanto al regalo così nessun altro lo sceglie.
          </p>

          {error && (
            <div className="rounded-xl border border-hairline bg-blush/40 px-3 py-2.5 text-[0.8125rem] text-ink">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="text-[0.8125rem] font-semibold uppercase tracking-label text-ink-muted underline-offset-4 transition hover:text-ink hover:underline disabled:opacity-50"
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={submitting || !name.trim()}
              className="inline-flex items-center gap-2 rounded-full bg-sky px-6 py-3 font-body text-[0.8125rem] font-semibold tracking-wide text-white shadow-sm transition hover:bg-sky-strong active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Salvataggio
                </>
              ) : (
                <>
                  Conferma <span aria-hidden>→</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
