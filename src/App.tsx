import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { clearPresoDa, fetchGifts, isConfigured, updatePresoDa } from './lib/airtable';
import type { Gift } from './types';
import { Header } from './components/Header';
import { GiftCard } from './components/GiftCard';
import { ClaimModal } from './components/ClaimModal';
import { Loader } from './components/Loader';
import { ErrorBanner } from './components/ErrorBanner';
import { useDebouncedCallback } from './hooks/useDebouncedCallback';

const ADMIN_TAP_THRESHOLD = 5;
const ADMIN_TAP_WINDOW_MS = 2500;

export default function App() {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [adminMode, setAdminMode] = useState(false);

  const tapCountRef = useRef(0);
  const tapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchGifts();
      setGifts(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Errore nel caricamento');
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedLoad = useDebouncedCallback(load, 300);

  useEffect(() => {
    if (!isConfigured()) {
      setError(
        'Configurazione mancante: crea un file .env con VITE_AIRTABLE_TOKEN, VITE_AIRTABLE_BASE_ID e VITE_AIRTABLE_TABLE.'
      );
      setLoading(false);
      return;
    }
    load();
  }, [load]);

  const { disponibili, presi } = useMemo(() => {
    const disponibili: Gift[] = [];
    const presi: Gift[] = [];
    for (const g of gifts) {
      if (g.presoDa) presi.push(g);
      else disponibili.push(g);
    }
    disponibili.sort((a, b) => {
      if (a.priorita !== b.priorita) return a.priorita ? -1 : 1;
      return a.nome.localeCompare(b.nome, 'it', { sensitivity: 'base' });
    });
    presi.sort((a, b) => a.nome.localeCompare(b.nome, 'it', { sensitivity: 'base' }));
    return { disponibili, presi };
  }, [gifts]);

  function handleTitleClick() {
    if (adminMode) return;
    tapCountRef.current += 1;
    if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
    tapTimerRef.current = setTimeout(() => {
      tapCountRef.current = 0;
    }, ADMIN_TAP_WINDOW_MS);

    if (tapCountRef.current >= ADMIN_TAP_THRESHOLD) {
      setAdminMode(true);
      tapCountRef.current = 0;
      if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
    }
  }

  async function handleConfirmClaim(name: string) {
    if (!selectedGift) return;
    const updated = await updatePresoDa(selectedGift.id, name);
    setGifts((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
    setSelectedGift(null);
    debouncedLoad();
  }

  async function handleFree(gift: Gift) {
    const ok = window.confirm(
      `Vuoi liberare "${gift.nome}"? Tornerà disponibile per tutti.`
    );
    if (!ok) return;
    try {
      const updated = await clearPresoDa(gift.id);
      setGifts((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Errore durante la liberazione del regalo');
    }
  }

  return (
    <div className="min-h-dvh">
      <Header
        disponibili={disponibili.length}
        totali={gifts.length}
        onTitleClick={handleTitleClick}
        adminMode={adminMode}
      />

      <main className="mx-auto max-w-3xl px-6 pb-24">
        {loading && <Loader />}

        {!loading && error && <ErrorBanner message={error} onRetry={load} />}

        {!loading && !error && gifts.length === 0 && (
          <div className="keepsake mx-auto max-w-xl p-8 text-center">
            <p className="u-eyebrow">In preparazione</p>
            <p className="mt-3 font-display text-2xl leading-snug text-ink">
              La lista è ancora vuota.
            </p>
            <p className="mt-2 text-sm text-ink-muted">
              Stiamo scegliendo i primi regali per Marco. Torna tra poco.
            </p>
          </div>
        )}

        {!loading && !error && gifts.length > 0 && (
          <>
            <section aria-labelledby="disponibili-title" className="mt-2">
              <div className="mb-6 flex items-baseline justify-between gap-4">
                <h2 id="disponibili-title" className="u-section-title">
                  Ancora disponibili
                </h2>
                <span className="u-eyebrow tabular-nums">
                  {disponibili.length.toString().padStart(2, '0')}
                </span>
              </div>

              {disponibili.length === 0 ? (
                <div className="keepsake p-8 text-center">
                  <p className="u-eyebrow">Tutto pronto</p>
                  <p className="mt-3 font-display text-2xl leading-snug text-ink">
                    Tutti i regali sono stati scelti.
                  </p>
                  <p className="mt-2 text-sm text-ink-muted">
                    Grazie di cuore a chi ha partecipato.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {disponibili.map((g) => (
                    <GiftCard key={g.id} gift={g} onSelect={setSelectedGift} />
                  ))}
                </div>
              )}
            </section>

            {presi.length > 0 && (
              <section aria-labelledby="presi-title" className="mt-16">
                <div className="mb-4 flex items-baseline justify-between gap-4">
                  <h2 id="presi-title" className="u-section-title text-ink-muted">
                    Già scelti
                  </h2>
                  <span className="u-eyebrow tabular-nums">
                    {presi.length.toString().padStart(2, '0')}
                  </span>
                </div>

                <div className="flex flex-col">
                  {presi.map((g) => (
                    <GiftCard
                      key={g.id}
                      gift={g}
                      onSelect={setSelectedGift}
                      adminMode={adminMode}
                      onFree={handleFree}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        <footer className="mt-20 flex flex-col items-center gap-3 border-t border-hairline pt-8 text-center">
          <span className="ornament">
            <span className="u-eyebrow">Grazie da Mamma e Papà</span>
          </span>
          <span aria-hidden className="text-lg leading-none text-ink/70">
            💛
          </span>
        </footer>
      </main>

      {selectedGift && (
        <ClaimModal
          gift={selectedGift}
          onClose={() => setSelectedGift(null)}
          onConfirm={handleConfirmClaim}
        />
      )}
    </div>
  );
}
