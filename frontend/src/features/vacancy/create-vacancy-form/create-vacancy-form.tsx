'use client';

import { FormEvent, useState } from 'react';

interface CreateVacancyFormProps {
    onCreate: (data: { title: string; company: string; notes?: string }) => Promise<void>;
}

export function CreateVacancyForm({ onCreate }: CreateVacancyFormProps) {
    const [title, setTitle] = useState('');
    const [company, setCompany] = useState('');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!title.trim() || !company.trim()) {
            return;
        }

        setIsSubmitting(true);

        try {
            await onCreate({
                title: title.trim(),
                company: company.trim(),
                notes: notes.trim() || undefined,
            });

            setTitle('');
            setCompany('');
            setNotes('');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="mt-6 space-y-3 rounded-xl border p-4">
            <h2 className="text-lg font-semibold">Add vacancy</h2>

            <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Position"
                className="w-full rounded border px-3 py-2"
            />

            <input
                value={company}
                onChange={(event) => setCompany(event.target.value)}
                placeholder="Company"
                className="w-full rounded border px-3 py-2"
            />

            <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Notes"
                className="w-full rounded border px-3 py-2"
                rows={4}
            />

            <button
                type="submit"
                disabled={isSubmitting}
                className="rounded border px-4 py-2"
            >
                {isSubmitting ? 'Creating...' : 'Add vacancy'}
            </button>
        </form>
    );
}