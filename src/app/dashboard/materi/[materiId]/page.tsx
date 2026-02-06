'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Clock, BookOpen, Calendar, TrendingUp, ArrowLeft } from 'lucide-react';

interface MateriData {
    id: string;
    nama: string;
    kategori: string;
    deskripsi: string;
    userProgress: {
        totalStudyTime: number;
        activeDays: number;
        lastStudied: string | null;
    };
}

export default function MateriDetailPage() {
    const params = useParams();
    const router = useRouter();
    const materiId = params.materiId as string;

    const [materi, setMateri] = useState<MateriData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Track study time
    const startTimeRef = useRef<number>(Date.now());
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const [currentStudyTime, setCurrentStudyTime] = useState(0);

    // Fetch materi data
    useEffect(() => {
        fetchMateri();
    }, [materiId]);

    // Track time spent on page
    useEffect(() => {
        startTimeRef.current = Date.now();

        // Update timer every second
        timerRef.current = setInterval(() => {
            const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
            setCurrentStudyTime(elapsed);
        }, 1000);

        // Save on unmount or page leave
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
            saveStudyTime();
        };
    }, []);

    // Save study time when user leaves page
    useEffect(() => {
        const handleBeforeUnload = () => {
            saveStudyTime();
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [currentStudyTime]);

    const fetchMateri = async () => {
        try {
            const response = await fetch(`/api/materi/${materiId}`);
            if (!response.ok) throw new Error('Failed to fetch materi');
            const data = await response.json();
            setMateri(data);
        } catch (error) {
            console.error('Error fetching materi:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const saveStudyTime = async () => {
        const studyTimeInSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);

        // Only save if studied for at least 10 seconds
        if (studyTimeInSeconds < 10) return;

        try {
            setIsSaving(true);
            const response = await fetch(`/api/materi/${materiId}/complete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    studyTimeInSeconds
                })
            });

            if (response.ok) {
                console.log('Study time saved successfully');
            }
        } catch (error) {
            console.error('Error saving study time:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleMarkComplete = async () => {
        await saveStudyTime();
        router.push('/dashboard/materi');
    };

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours}j ${minutes}m`;
        }
        return `${minutes}m ${secs}s`;
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Belum pernah';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!materi) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p className="text-gray-600 mb-4">Materi tidak ditemukan</p>
                <button
                    onClick={() => router.push('/dashboard/materi')}
                    className="text-blue-600 hover:underline"
                >
                    Kembali ke daftar materi
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => router.push('/dashboard/materi')}
                            className="flex items-center text-gray-600 hover:text-gray-900"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Kembali
                        </button>

                        <div className="flex items-center gap-4">
                            {/* Current Session Timer */}
                            <div className="flex items-center text-sm text-gray-600">
                                <Clock className="w-4 h-4 mr-1" />
                                {formatTime(currentStudyTime)}
                            </div>

                            {isSaving && (
                                <span className="text-xs text-gray-500">Menyimpan...</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Progress Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center mb-2">
                            <Clock className="w-5 h-5 text-blue-600 mr-2" />
                            <span className="text-sm text-gray-600">Total Waktu Belajar</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                            {formatTime(materi.userProgress.totalStudyTime)}
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center mb-2">
                            <Calendar className="w-5 h-5 text-green-600 mr-2" />
                            <span className="text-sm text-gray-600">Hari Aktif</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                            {materi.userProgress.activeDays} hari
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center mb-2">
                            <TrendingUp className="w-5 h-5 text-purple-600 mr-2" />
                            <span className="text-sm text-gray-600">Terakhir Belajar</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">
                            {formatDate(materi.userProgress.lastStudied)}
                        </p>
                    </div>
                </div>

                {/* Materi Content */}
                <div className="bg-white rounded-lg shadow-sm p-8">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                                {materi.kategori}
                            </span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {materi.nama}
                        </h1>
                    </div>

                    {/* Description */}
                    {materi.deskripsi && (
                        <div className="prose max-w-none mb-8">
                            <p className="text-gray-700 leading-relaxed">
                                {materi.deskripsi}
                            </p>
                        </div>
                    )}

                    {/* Materi Content - Replace with actual content */}
                    <div className="border-t pt-8">
                        <h2 className="text-xl font-semibold mb-4 flex items-center">
                            <BookOpen className="w-5 h-5 mr-2" />
                            Konten Pembelajaran
                        </h2>

                        <div className="space-y-4">
                            {/* Add your actual materi content here */}
                            <div className="bg-gray-50 rounded-lg p-6">
                                <p className="text-gray-600">
                                    Konten materi akan ditampilkan di sini...
                                </p>
                                {/* Example content sections */}
                                <div className="mt-6 space-y-6">
                                    <div>
                                        <h3 className="font-semibold text-lg mb-2">Pengenalan</h3>
                                        <p className="text-gray-700">
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit...
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-lg mb-2">Konsep Utama</h3>
                                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                                            <li>Konsep pertama</li>
                                            <li>Konsep kedua</li>
                                            <li>Konsep ketiga</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-lg mb-2">Contoh Soal</h3>
                                        <p className="text-gray-700">
                                            Contoh penerapan konsep...
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-8 flex justify-end gap-4">
                        <button
                            onClick={() => router.push(`/dashboard/latihan-soal/${materiId}`)}
                            className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Latihan Soal
                        </button>
                        <button
                            onClick={handleMarkComplete}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Selesai & Simpan Progress
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}