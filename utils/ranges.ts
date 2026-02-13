import { Range, RangeSegment } from '@/types/analysis';

export interface Preset {
    id: string;
    name: string;
    unit: string;
    range: Range;
}

export const RANGE_PRESETS: Preset[] = [
    {
        id: 'colesterolo-totale',
        name: 'Colesterolo Totale',
        unit: 'mg/dL',
        range: {
            tipo: 'multi-range',
            segmenti: [
                { max: 200, label: 'Ottimale', status: 'OK', color: 'green' },
                { min: 200, max: 239, label: 'Borderline', status: 'Warning', color: 'orange' },
                { min: 240, label: 'Alto', status: 'Critical', color: 'red' }
            ]
        }
    },
    {
        id: 'hdl',
        name: 'Colesterolo HDL',
        unit: 'mg/dL',
        range: {
            tipo: 'multi-range',
            segmenti: [
                { min: 60, label: 'Alto (Protettivo)', status: 'OK', color: 'green' },
                { min: 40, max: 59, label: 'Normale', status: 'OK', color: 'green' },
                { max: 40, label: 'Basso', status: 'Warning', color: 'orange' }
            ]
        }
    },
    {
        id: 'ldl',
        name: 'Colesterolo LDL',
        unit: 'mg/dL',
        range: {
            tipo: 'multi-range',
            segmenti: [
                { max: 100, label: 'Ottimale', status: 'OK', color: 'green' },
                { min: 100, max: 129, label: 'Quasi Ottimale', status: 'OK', color: 'green' },
                { min: 130, max: 159, label: 'Borderline Alto', status: 'Warning', color: 'orange' },
                { min: 160, max: 189, label: 'Alto', status: 'Critical', color: 'red' },
                { min: 190, label: 'Molto Alto', status: 'Critical', color: 'red' }
            ]
        }
    },
    {
        id: 'glicemia',
        name: 'Glicemia (Digiuno)',
        unit: 'mg/dL',
        range: {
            tipo: 'multi-range',
            segmenti: [
                { min: 70, max: 99, label: 'Normale', status: 'OK', color: 'green' },
                { min: 100, max: 125, label: 'Prediabete', status: 'Warning', color: 'orange' },
                { min: 126, label: 'Diabete', status: 'Critical', color: 'red' }
            ]
        }
    },
    {
        id: 'pressione-sistolica',
        name: 'Pressione Sistolica',
        unit: 'mmHg',
        range: {
            tipo: 'multi-range',
            segmenti: [
                { max: 120, label: 'Normale', status: 'OK', color: 'green' },
                { min: 120, max: 129, label: 'Elevata', status: 'Warning', color: 'yellow' },
                { min: 130, max: 139, label: 'Ipertensione Grado 1', status: 'Warning', color: 'orange' },
                { min: 140, label: 'Ipertensione Grado 2', status: 'Critical', color: 'red' }
            ]
        }
    }
];

export const calculateStatus = (value: number | string, range: Range): { status: string, label?: string } => {
    if (range.tipo === 'testuale') {
        const valStr = String(value).toLowerCase();
        const rangeStr = (range.testo || '').toLowerCase();

        // Simple heuristic for textual: if matches range text (e.g. "Negative" matches "Negative"), it's OK.
        // Otherwise, without sophisticated NLP, we might default to Check manually or just OK if exact match.
        // For now, let's assume if it contains "assente" or "negativo" or "normale" it's good.
        if (['assente', 'negativo', 'normale', 'ok'].some(k => valStr.includes(k))) return { status: 'OK' };

        // Use logic from mock if needed, but for now fallback
        return { status: 'Note' };
    }

    const numVal = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numVal)) return { status: 'Unknown' };

    if (range.tipo === 'numerico') {
        const min = range.min ?? -Infinity;
        const max = range.max ?? Infinity;

        if (numVal >= min && numVal <= max) return { status: 'OK' };
        return { status: 'KO' }; // Simple Out of Range
    }

    if (range.tipo === 'multi-range' && range.segmenti) {
        // Find the matching segment
        const segment = range.segmenti.find(seg => {
            const min = seg.min ?? -Infinity;
            const max = seg.max ?? Infinity;
            return numVal >= min && numVal <= max;
        });

        if (segment) {
            return { status: segment.status, label: segment.label };
        }

        return { status: 'Unknown' }; // Should cover all ranges theoretically
    }

    return { status: 'Unknown' };
};
