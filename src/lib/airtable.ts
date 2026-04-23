import type { AirtableListResponse, AirtableRecord, Gift } from '../types';

const TOKEN = import.meta.env.VITE_AIRTABLE_TOKEN;
const BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID;
const TABLE = import.meta.env.VITE_AIRTABLE_TABLE;

const BASE_URL = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(
  TABLE ?? ''
)}`;

function headers(): HeadersInit {
  return {
    Authorization: `Bearer ${TOKEN}`,
    'Content-Type': 'application/json',
  };
}

export function isConfigured(): boolean {
  return Boolean(TOKEN && BASE_ID && TABLE);
}

function mapRecord(record: AirtableRecord): Gift {
  const f = record.fields ?? {};
  return {
    id: record.id,
    nome: f.Nome?.trim() ?? '',
    dettaglio: f.Dettaglio?.trim() ?? '',
    note: f.Note?.trim() ?? '',
    priorita: Boolean(f.Priorità),
    presoDa: f['Preso da']?.trim() ?? '',
  };
}

async function parseError(res: Response): Promise<Error> {
  let message = `Errore Airtable (${res.status})`;
  try {
    const data = await res.json();
    if (data?.error?.message) message = data.error.message;
    else if (typeof data?.error === 'string') message = data.error;
  } catch {
    // ignore
  }
  return new Error(message);
}

export async function fetchGifts(): Promise<Gift[]> {
  if (!isConfigured()) {
    throw new Error(
      'Airtable non configurato: imposta VITE_AIRTABLE_TOKEN, VITE_AIRTABLE_BASE_ID e VITE_AIRTABLE_TABLE nel .env.'
    );
  }

  const all: AirtableRecord[] = [];
  let offset: string | undefined;

  do {
    const url = new URL(BASE_URL);
    url.searchParams.set('pageSize', '100');
    if (offset) url.searchParams.set('offset', offset);

    const res = await fetch(url.toString(), { headers: headers() });
    if (!res.ok) throw await parseError(res);

    const data = (await res.json()) as AirtableListResponse;
    all.push(...data.records);
    offset = data.offset;
  } while (offset);

  return all.map(mapRecord);
}

export async function updatePresoDa(id: string, presoDa: string): Promise<Gift> {
  if (!isConfigured()) throw new Error('Airtable non configurato.');

  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: headers(),
    body: JSON.stringify({
      fields: { 'Preso da': presoDa },
    }),
  });

  if (!res.ok) throw await parseError(res);

  const data = (await res.json()) as AirtableRecord;
  return mapRecord(data);
}

export async function clearPresoDa(id: string): Promise<Gift> {
  return updatePresoDa(id, '');
}
