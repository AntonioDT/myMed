export type RangeType = 'numerico' | 'testuale';

export interface Range {
    tipo: RangeType;
    min?: number | null;
    max?: number | null;
    testo?: string;
}

export interface Value {
    id: number;
    nomeValore: string;
    valore: number | string;
    unitaMisura: string | null;
    range: Range;
    stato: string;
}

export interface Analysis {
    id: string;
    categoria: string;
    data: string;
    valori: Value[];
}
