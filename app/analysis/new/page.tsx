'use client';

import { useState } from 'react';
import { useForm, useFieldArray, Control, useWatch } from 'react-hook-form';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react';
import styles from './page.module.scss';
import { ReportForm, FormSection, FormValue } from '@/types/form';
import clsx from 'clsx';
import { RangeType } from '@/types/analysis';
import { RANGE_PRESETS, Preset, calculateStatus } from '@/utils/ranges';
import { UNITS } from '@/utils/units';
import { Select } from '@/components/Select';

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
    const { register, control, handleSubmit, setValue, formState: { errors } } = useForm<ReportForm>({
        defaultValues: {
            date: new Date().toISOString().split('T')[0],
            sections: [DEFAULT_SECTION]
        }
    });

    const { fields: sectionFields, append: appendSection, remove: removeSection } = useFieldArray({
        control,
        name: "sections"
    });

    const onSubmit = (data: ReportForm) => {
        // Validation: Verify there is at least one value
        const hasValues = data.sections.some(section => section.values && section.values.length > 0);

        if (!hasValues) {
            alert("Cannot save an empty report. Please add at least one value.");
            return;
        }

        // Transform data to match the Analysis interface and save

        const analysisEntry = {
            id: Date.now().toString(),
            data: data.date,
            laboratorio: data.laboratorio,
            sezioni: data.sections.map((section, idx) => ({
                id: `sec-${Date.now()}-${idx}`,
                categoria: section.category || null,
                valori: section.values.map((val, vIdx) => {
                    const preset = RANGE_PRESETS.find(p => p.name === val.name); // Simple match by name for now, ideal would be ID
                    // If rangeType is multi-range, try to find the preset definition

                    let rangeObj: any = {
                        tipo: val.rangeType,
                        min: val.rangeType === 'numerico' && val.min ? parseFloat(val.min) : null,
                        max: val.rangeType === 'numerico' && val.max ? parseFloat(val.max) : null,
                        testo: val.rangeType === 'testuale' ? val.textRange : undefined
                    };

                    if (val.rangeType === 'multi-range' && preset) {
                        rangeObj = preset.range;
                    }

                    // Calculate status
                    // We need a helper here or import it
                    // For now let's use a simplified local check or assume the helper helps us on render
                    // But we store 'stato' in the DB. So we should calculate it now.

                    // Let's bring in calculateStatus or replicate simple logic?
                    // Better to rely on helper. But we can't easily import logic inside map if it's complex.
                    // Let's import calculateStatus from utils/ranges at top of file.

                    const numVal = parseFloat(val.value); // Might be string if textual
                    const valForCalc = isNaN(numVal) ? val.value : numVal;

                    const statusResult = calculateStatus(valForCalc, rangeObj);

                    return {
                        id: parseInt(`${Date.now()}${idx}${vIdx}`),
                        nomeValore: val.name,
                        valore: val.value,
                        unitaMisura: val.unit || null,
                        range: rangeObj,
                        stato: statusResult.status
                    };
                })
            }))
        };

        // addAnalysis(analysisEntry); // Removed to prevent double entry (in memory + localStorage)
        const newEntries = [analysisEntry];

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
                <div className={styles.grid}>
                    <div className={styles.formGroup}>
                        <label>Date</label>
                        <input type="date" {...register("date", { required: true })} />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Laboratory (Optional)</label>
                        <input {...register("laboratorio")} placeholder="e.g. Laboratorio San Marco" />
                    </div>
                </div>

                {sectionFields.map((section, index) => (
                    <SectionField
                        key={section.id}
                        control={control}
                        index={index}
                        register={register}
                        remove={() => removeSection(index)}
                        setValue={setValue}
                    />
                ))}

                <div className={styles.mainActions}>
                    <button
                        type="button"
                        onClick={() => appendSection(DEFAULT_SECTION)}
                        className={styles.addSection}
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

function SectionField({ control, index, register, remove, setValue }: { control: Control<ReportForm>, index: number, register: any, remove: () => void, setValue: any }) {
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
                        {...register(`sections.${index}.category`, { required: false })}
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
                        setValue={setValue}
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

function ValueRow({ control, sectionIndex, valueIndex, register, remove, setValue }: { control: Control<ReportForm>, sectionIndex: number, valueIndex: number, register: any, remove: () => void, setValue: any }) {
    // Watch range type to conditionally show min/max or text fields
    const rangeType = useWatch({
        control,
        name: `sections.${sectionIndex}.values.${valueIndex}.rangeType`
    });

    // Watch the value name to detect if it matches a preset
    const valueName = useWatch({
        control,
        name: `sections.${sectionIndex}.values.${valueIndex}.name`
    });

    const activePreset = RANGE_PRESETS.find(p => p.name === valueName);

    const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const presetId = e.target.value;
        const preset = RANGE_PRESETS.find(p => p.id === presetId);
        if (preset) {
            setValue(`sections.${sectionIndex}.values.${valueIndex}.name`, preset.name);
            setValue(`sections.${sectionIndex}.values.${valueIndex}.unit`, preset.unit);
            setValue(`sections.${sectionIndex}.values.${valueIndex}.rangeType`, preset.range.tipo);
            // In a real app we'd store the segments info in the form state too, 
            // but for this MVP we might just want to use the preset reference or simplified storage.
            // For now, let's just fill basic info. The advanced multi-range storage needs 'segments' in form.
        }
    };

    return (
        <div className={styles.valueRow}>
            <div className={styles.rowHeader}>
                <span>Value #{valueIndex + 1}</span>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <Select
                        onChange={handlePresetChange}
                        className={styles.presetSelect}
                        style={{ padding: '4px', fontSize: '0.8rem', width: 'auto' }}
                        value=""
                    >
                        <option value="" disabled>Load Preset...</option>
                        {RANGE_PRESETS.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </Select>
                    <button type="button" onClick={remove} className={styles.removeValue}>
                        <Trash2 size={16} />
                    </button>
                </div>
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
                    <UnitSelect
                        control={control}
                        sectionIndex={sectionIndex}
                        valueIndex={valueIndex}
                        setValue={setValue}
                    />
                </div>
                <div className={styles.formGroup}>
                    <Select
                        label="Range Type"
                        {...register(`sections.${sectionIndex}.values.${valueIndex}.rangeType`)}
                    >
                        <option value="numerico">Numeric</option>
                        <option value="testuale">Textual</option>
                        <option value="multi-range">Multi-segment / Preset</option>
                    </Select>
                </div>

                {rangeType === 'numerico' && (
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
                )}

                {rangeType === 'testuale' && (
                    <div className={clsx(styles.formGroup, styles.fullWidth)}>
                        <label>Expected Text</label>
                        <input {...register(`sections.${sectionIndex}.values.${valueIndex}.textRange`)} placeholder="e.g. Negative" />
                    </div>
                )}

                {rangeType === 'multi-range' && activePreset && (
                    <div className={clsx(styles.formGroup, styles.fullWidth)}>
                        <div style={{ fontSize: '0.85rem', color: '#666', background: '#f5f5f5', padding: '8px', borderRadius: '4px' }}>
                            <strong>Reference Ranges for {activePreset.name}:</strong>
                            <ul style={{ paddingLeft: '20px', marginTop: '4px', marginBottom: 0 }}>
                                {activePreset.range.segmenti?.map((seg, i) => (
                                    <li key={i}>
                                        <span style={{ fontWeight: 500 }}>{seg.label}:</span>{' '}
                                        {seg.min !== undefined ? `> ${seg.min}` : ''}
                                        {seg.min !== undefined && seg.max !== undefined ? ' and ' : ''}
                                        {seg.max !== undefined ? `< ${seg.max}` : ''}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {rangeType === 'multi-range' && !activePreset && (
                    <div className={clsx(styles.formGroup, styles.fullWidth)}>
                        <p style={{ fontSize: '0.8rem', color: 'gray' }}>
                            Value status will be calculated based on standard ranges if a preset matches, or you can define custom ranges (Not Implemented in UI yet).
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

function UnitSelect({ control, sectionIndex, valueIndex, setValue }: { control: Control<ReportForm>, sectionIndex: number, valueIndex: number, setValue: any }) {
    const unitValue = useWatch({
        control,
        name: `sections.${sectionIndex}.values.${valueIndex}.unit`
    });

    const isCustom = unitValue && !UNITS.includes(unitValue) && unitValue !== 'custom';

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (value === 'OTHER') {
            setValue(`sections.${sectionIndex}.values.${valueIndex}.unit`, 'custom');
        } else {
            setValue(`sections.${sectionIndex}.values.${valueIndex}.unit`, value);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(`sections.${sectionIndex}.values.${valueIndex}.unit`, e.target.value);
    };

    const clearCustom = () => {
        setValue(`sections.${sectionIndex}.values.${valueIndex}.unit`, '');
    };

    const showInput = unitValue === 'custom' || isCustom;

    if (showInput) {
        return (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                    type="text"
                    value={unitValue === 'custom' ? '' : unitValue}
                    onChange={handleInputChange}
                    placeholder="Type unit..."
                    autoFocus={unitValue === 'custom'}
                    style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
                <button
                    type="button"
                    onClick={clearCustom}
                    title="Back to list"
                    style={{ padding: '4px 8px', background: '#f0f0f0', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', fontSize: '1.2rem', lineHeight: '1' }}
                >
                    ×
                </button>
            </div>
        );
    }

    return (
        <Select
            value={UNITS.includes(unitValue) ? unitValue : ''}
            onChange={handleSelectChange}
            style={{ width: '100%' }}
        >
            <option value="">Select Unit...</option>
            {UNITS.map(u => (
                <option key={u} value={u}>{u}</option>
            ))}
            <option value="OTHER">Altro...</option>
        </Select>
    );
}
