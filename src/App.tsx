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

      <main className="mx-auto max-w-3xl px-4 pb-20 sm:px-6">
        {loading && <Loader />}

        {!loading && error && <ErrorBanner message={error} onRetry={load} />}

        {!loading && !error && gifts.length === 0 && (
          <div className="soft-card mx-auto max-w-xl p-8 text-center">
            <p className="text-3xl" aria-hidden>🐻</p>
            <p className="mt-2 font-display text-lg font-700 text-slate-700">
              La lista è ancora vuota
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Torna tra poco, stiamo aggiungendo i primi regali!
            </p>
          </div>
        )}

        {!loading && !error && gifts.length > 0 && (
          <>
            <section aria-labelledby="disponibili-title" className="mt-2">
              <div className="mb-[40px] flex items-baseline justify-between px-1">
                <h2
                  id="disponibili-title"
                  className="font-display text-xl font-700 text-slate-700 sm:text-2xl"
                >
                  Ancora disponibili
                </h2>
                <span className="text-sm font-semibold text-sky-deep">
                  {disponibili.length}
                </span>
              </div>

              {disponibili.length === 0 ? (
                <div className="soft-card p-6 text-center">
                  <p className="text-2xl" aria-hidden>🎉</p>
                  <p className="mt-2 font-display text-lg font-700 text-slate-700">
                    Tutti i regali sono stati scelti!
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Grazie di cuore a tutti 💛
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
              <section aria-labelledby="presi-title" className="mt-12">
                <div className="mb-4 flex items-baseline justify-between px-1">
                  <h2
                    id="presi-title"
                    className="font-display text-xl font-700 text-slate-500 sm:text-2xl"
                  >
                    Già scelti
                  </h2>
                  <span className="text-sm font-semibold text-slate-400">
                    {presi.length}
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
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

        <footer className="mt-16 text-center text-xs text-slate-400">
          <p>
            Fatto con <span aria-hidden>💛</span> per accogliere Marco<br/>
            Grazie da Mamma e Papà!
          </p>
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
