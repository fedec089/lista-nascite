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
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 pt-6 sm:items-center sm:pt-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="claim-modal-title"
    >
      <button
        type="button"
        aria-label="Chiudi"
        onClick={() => !submitting && onClose()}
        className="absolute inset-0 bg-gradient-to-br from-sky-deep/40 via-slate-900/30 to-blush/30 backdrop-blur-sm animate-fade-in"
      />

      <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl animate-fade-in sm:p-8">
        <div className="mb-1 text-4xl" aria-hidden>
          🎁
        </div>
        <h2 id="claim-modal-title" className="font-display text-2xl font-800 text-slate-800">
          Stai scegliendo
        </h2>
        <p className="mt-1 font-display text-xl font-700 text-sky-deep">
          {gift.nome}
        </p>
        {gift.dettaglio && (
          <p className="mt-1 text-sm text-slate-500">{gift.dettaglio}</p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-slate-700">
              Come ti chiami?
            </span>
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Es. Zia Giulia"
              disabled={submitting}
              maxLength={80}
              className="w-full rounded-2xl border-2 border-sky-powder bg-white px-4 py-3 text-base text-slate-800 placeholder:text-slate-400 focus:border-sky-deep focus:outline-none disabled:opacity-50"
            />
          </label>

          <p className="text-xs text-slate-500">
            Il tuo nome sarà visibile accanto al regalo scelto così gli altri sanno che è già stato preso.
          </p>

          {error && (
            <div className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-600">
              {error}
            </div>
          )}

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-full px-5 py-2.5 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 disabled:opacity-50"
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={submitting || !name.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-deep px-5 py-2.5 text-sm font-bold text-white shadow-card transition hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/50 border-t-white" />
                  Salvataggio…
                </>
              ) : (
                <>Conferma <span aria-hidden>💛</span></>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
