'use client';

import { useState } from 'react';
import { useForm, useFieldArray, Control, useWatch } from 'react-hook-form';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react';
import styles from './page.module.scss';
import { ReportForm, FormSection, FormValue } from '@/types/form';
import { addAnalysis } from '@/utils/mock';
import clsx from 'clsx';
import { RangeType } from '@/types/analysis';

const DEFAULT_VALUE: FormValue = {
    name: '',
    value: '',
    unit: '',
    rangeType: 'numerico',
    min: '',
    max: '',
    textRange: ''
};

const DEFAULT_SECTION: FormSection = {
    category: '',
    values: [DEFAULT_VALUE]
};

export default function AddAnalysisPage() {
    const router = useRouter();
    const { register, control, handleSubmit, formState: { errors } } = useForm<ReportForm>({
        defaultValues: {
            date: new Date().toISOString().split('T')[0],
            sections: [DEFAULT_SECTION]
        }
    });

    const { fields: sectionFields, append: appendSection, remove: removeSection } = useFieldArray({
        control,
        name: "sections"
    });

    const sections = useWatch({
        control,
        name: "sections"
    });

    const isLastSectionComplete = sections && sections.length > 0
        ? !!sections[sections.length - 1].category
        : true;

    const onSubmit = (data: ReportForm) => {
        // Transform data to match the Analysis interface and save

        const newEntries: any[] = [];

        data.sections.forEach((section, idx) => {
            const analysisEntry = {
                id: Date.now().toString() + idx,
                categoria: section.category || 'Untitled',
                data: data.date,
                valori: section.values.map((val, vIdx) => ({
                    id: parseInt(`${Date.now()}${idx}${vIdx}`),
                    nomeValore: val.name,
                    valore: val.value,
                    unitaMisura: val.unit || null,
                    range: {
                        tipo: val.rangeType,
                        min: val.rangeType === 'numerico' && val.min ? parseFloat(val.min) : null,
                        max: val.rangeType === 'numerico' && val.max ? parseFloat(val.max) : null,
                        testo: val.rangeType === 'testuale' ? val.textRange : undefined
                    },
                    stato: 'normale'
                }))
            };
            addAnalysis(analysisEntry);
            newEntries.push(analysisEntry);
        });

        // Save to localStorage for persistence across reloads/navigations
        try {
            const existingData = localStorage.getItem('myMed_analysis_data');
            const parsedData = existingData ? JSON.parse(existingData) : [];
            const updatedData = [...newEntries, ...parsedData];
            localStorage.setItem('myMed_analysis_data', JSON.stringify(updatedData));
        } catch (error) {
            console.error('Failed to save to localStorage', error);
        }

        alert("Analysis saved successfully!");
        router.push('/');
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <Link href="/" className={styles.backLink}>
                    <ArrowLeft size={20} />
                    Back to Dashboard
                </Link>
                <h1>New Analysis Report</h1>
            </header>

            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                <div className={styles.formGroup}>
                    <label>Date</label>
                    <input type="date" {...register("date", { required: true })} />
                </div>

                {sectionFields.map((section, index) => (
                    <SectionField
                        key={section.id}
                        control={control}
                        index={index}
                        register={register}
                        remove={() => removeSection(index)}
                    />
                ))}

                <div className={styles.mainActions}>
                    <button
                        type="button"
                        onClick={() => appendSection(DEFAULT_SECTION)}
                        className={styles.addSection}
                        disabled={!isLastSectionComplete}
                        style={{ opacity: !isLastSectionComplete ? 0.5 : 1, cursor: !isLastSectionComplete ? 'not-allowed' : 'pointer' }}
                    >
                        <Plus size={20} /> Add Category Section
                    </button>
                    <button type="submit" className={styles.submit}>
                        <Save size={20} /> Save Report
                    </button>
                </div>
            </form>
        </div>
    );
}

function SectionField({ control, index, register, remove }: { control: Control<ReportForm>, index: number, register: any, remove: () => void }) {
    const { fields, append, remove: removeValue } = useFieldArray({
        control,
        name: `sections.${index}.values`
    });

    const values = useWatch({
        control,
        name: `sections.${index}.values`
    });

    const isLastValueComplete = values && values.length > 0
        ? !!(values[values.length - 1].name && values[values.length - 1].value)
        : true;

    return (
        <div className={styles.section}>
            <div className={styles.sectionHeader}>
                <div className={styles.formGroup} style={{ flex: 1 }}>
                    <label>Category (e.g., Emocromo)</label>
                    <input
                        {...register(`sections.${index}.category`, { required: true })}
                        placeholder="Enter category name"
                    />
                </div>
                {index > 0 && (
                    <button type="button" onClick={remove} className={styles.removeSection} title="Remove Section">
                        <Trash2 size={20} />
                    </button>
                )}
            </div>

            <div className={styles.valuesList}>
                {fields.map((val, vIndex) => (
                    <ValueRow
                        key={val.id}
                        control={control}
                        sectionIndex={index}
                        valueIndex={vIndex}
                        register={register}
                        remove={() => removeValue(vIndex)}
                    />
                ))}
            </div>

            <div className={styles.actions}>
                <button
                    type="button"
                    onClick={() => append(DEFAULT_VALUE)}
                    className={styles.addValue}
                    disabled={!isLastValueComplete}
                    style={{ opacity: !isLastValueComplete ? 0.5 : 1, cursor: !isLastValueComplete ? 'not-allowed' : 'pointer' }}
                >
                    <Plus size={16} /> Add Value
                </button>
            </div>
        </div>
    );
}

function ValueRow({ control, sectionIndex, valueIndex, register, remove }: { control: Control<ReportForm>, sectionIndex: number, valueIndex: number, register: any, remove: () => void }) {
    // Watch range type to conditionally show min/max or text fields
    const rangeType = useWatch({
        control,
        name: `sections.${sectionIndex}.values.${valueIndex}.rangeType`
    });

    return (
        <div className={styles.valueRow}>
            <div className={styles.rowHeader}>
                <span>Value #{valueIndex + 1}</span>
                <button type="button" onClick={remove} className={styles.removeValue}>
                    <Trash2 size={16} />
                </button>
            </div>

            <div className={styles.grid}>
                <div className={styles.formGroup}>
                    <label>Name</label>
                    <input {...register(`sections.${sectionIndex}.values.${valueIndex}.name`, { required: true })} placeholder="e.g. WBC" />
                </div>
                <div className={styles.formGroup}>
                    <label>Value</label>
                    <input {...register(`sections.${sectionIndex}.values.${valueIndex}.value`, { required: true })} placeholder="Result value" />
                </div>
                <div className={styles.formGroup}>
                    <label>Unit</label>
                    <input {...register(`sections.${sectionIndex}.values.${valueIndex}.unit`)} placeholder="e.g. mg/dL" />
                </div>
                <div className={styles.formGroup}>
                    <label>Range Type</label>
                    <select {...register(`sections.${sectionIndex}.values.${valueIndex}.rangeType`)}>
                        <option value="numerico">Numeric</option>
                        <option value="testuale">Textual</option>
                    </select>
                </div>

                {rangeType === 'numerico' ? (
                    <>
                        <div className={styles.formGroup}>
                            <label>Min</label>
                            <input type="number" step="any" {...register(`sections.${sectionIndex}.values.${valueIndex}.min`)} placeholder="Min" />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Max</label>
                            <input type="number" step="any" {...register(`sections.${sectionIndex}.values.${valueIndex}.max`)} placeholder="Max" />
                        </div>
                    </>
                ) : (
                    <div className={clsx(styles.formGroup, styles.fullWidth)}>
                        <label>Expected Text</label>
                        <input {...register(`sections.${sectionIndex}.values.${valueIndex}.textRange`)} placeholder="e.g. Negative" />
                    </div>
                )}
            </div>
        </div>
    );
}
