'use client';

import { useMateriList } from '@/hooks/use-latihan-soal';
import { LatihanSoalType } from '@/types/latihan-soal';
import Link from 'next/link';
import { Book, ChevronRight, Loader2 } from 'lucide-react';

const KATEGORI_LABELS: Record<LatihanSoalType, string> = {
    PU: 'General Reasoning',
    PBM: 'Reading Comprehension & Writing',
    PPU: 'General Knowledge & Understanding',
    PK: 'Quantitative Knowledge',
    LITERASIBINDO: 'Indonesian Literacy',
    LITERASIBINGG: 'English Literacy'
};

const KATEGORI_COLORS: Record<LatihanSoalType, string> = {
    PU: 'bg-blue-500',
    PBM: 'bg-green-500',
    PPU: 'bg-purple-500',
    PK: 'bg-orange-500',
    LITERASIBINDO: 'bg-pink-500',
    LITERASIBINGG: 'bg-indigo-500'
};

export default function LatihanSoalPage() {
    const { materiList, loading, error } = useMateriList();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
                    Error: {error}
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    UTBK Practice Questions
                </h1>
                <p className="text-gray-600">
                    Select the material you want to study
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {materiList.map((materi) => (
                    <Link
                        key={materi.id}
                        href={`/dashboard/latihan-soal/${materi.id}`}
                        className="block group"
                    >
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div
                                    className={`${KATEGORI_COLORS[materi.kategori]} w-12 h-12 rounded-lg flex items-center justify-center text-white`}
                                >
                                    <Book className="w-6 h-6" />
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                            </div>

                            <h3 className="font-semibold text-lg text-gray-900 mb-2">
                                {materi.nama}
                            </h3>

                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">
                                    {KATEGORI_LABELS[materi.kategori]}
                                </span>
                                {materi._count && (
                                    <span className="text-blue-600 font-medium">
                                        {materi._count.soalLatihan} questions
                                    </span>
                                )}
                            </div>

                            {materi.deskripsi && (
                                <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                                    {materi.deskripsi}
                                </p>
                            )}
                        </div>
                    </Link>
                ))}
            </div>

            {materiList.length === 0 && (
                <div className="text-center py-12">
                    <Book className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No materials available yet</p>
                </div>
            )}
        </div>
    );
}