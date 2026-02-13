export type RangeType = 'numerico' | 'testuale' | 'multi-range';

export interface RangeSegment {
    min?: number | null;
    max?: number | null;
    label: string;
    status: 'OK' | 'Warning' | 'Critical';
    color?: string;
}

export interface Range {
    tipo: RangeType;
    min?: number | null;
    max?: number | null;
    testo?: string;
    segmenti?: RangeSegment[];
}

export interface Value {
    id: number;
    nomeValore: string;
    valore: number | string;
    unitaMisura: string | null;
    range: Range;
    stato: string;
}

export interface Section {
    id: string;
    categoria: string | null;
    valori: Value[];
}

export interface Analysis {
    id: string;
    data: string;
    laboratorio?: string;
    sezioni: Section[];
}
