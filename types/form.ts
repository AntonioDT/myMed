import { RangeType } from "./analysis";

export interface FormValue {
    name: string;
    value: string;
    unit: string;
    rangeType: RangeType;
    min?: string;
    max?: string;
    textRange?: string;
}

export interface FormSection {
    category: string;
    values: FormValue[];
}

export interface ReportForm {
    date: string;
    sections: FormSection[];
}
