import { RangeType } from "./analysis";

export interface FormValue {
    name: string;
    value: string;
    unit: string;
    rangeType: RangeType;
    min?: string;
    max?: string;
    textRange?: string;
    note?: string;
}

export interface FormSection {
    category?: string;
    values: FormValue[];
}

export interface ReportForm {
    date: string;
    laboratorio?: string;
    sections: FormSection[];
}
