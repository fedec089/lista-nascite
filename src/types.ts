export interface Gift {
  id: string;
  nome: string;
  dettaglio: string;
  note: string;
  priorita: boolean;
  presoDa: string;
}

export interface AirtableRecord {
  id: string;
  createdTime?: string;
  fields: {
    Nome?: string;
    Dettaglio?: string;
    Note?: string;
    Priorità?: boolean;
    'Preso da'?: string;
  };
}

export interface AirtableListResponse {
  records: AirtableRecord[];
  offset?: string;
}
