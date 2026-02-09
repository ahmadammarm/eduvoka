'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { useSoalByMateri } from '@/hooks/use-latihan-soal';
import { SessionType } from '@/types/latihan-soal';
import { Book, Clock, Target, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function MateriDetailPage() {
	const params = useParams();
	const router = useRouter();
	const materiId = params.materiId as string;

	const [selectedMode, setSelectedMode] = useState<SessionType>('LATIHAN');
	const { soalList, materi, loading, error } = useSoalByMateri(materiId, selectedMode);
	const [isStarting, setIsStarting] = useState(false);

	const handleStartSession = async () => {
		if (soalList.length === 0) {
			Swal.fire({
				icon: 'warning',
				title: 'No Questions',
				text: 'No questions available for this mode',
				confirmButtonColor: '#3b82f6'
			});
			return;
		}

		setIsStarting(true);
		try {
			// Navigate to practice page with mode parameter
			router.push(`/dashboard/latihan-soal/${materiId}/practice?mode=${selectedMode}`);
		} catch (err) {
			Swal.fire({
				icon: 'error',
				title: 'Failed to Start',
				text: 'Failed to start practice session. Please try again',
				confirmButtonColor: '#3b82f6'
			});
			setIsStarting(false);
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<Loader2 className="w-8 h-8 animate-spin text-blue-500" />
			</div>
		);
	}

	if (error || !materi) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
					Error: {error || 'Material not found'}
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-1 flex-col gap-4 pt-2">
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href="/dashboard" className="text-gray-500 dark:text-gray-400 dark:hover:text-white">Dashboard</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink href="/dashboard/latihan-soal" className="text-gray-500 dark:text-gray-400 dark:hover:text-white">Practice Questions</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage className="text-black dark:text-white">{materi.nama}</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
			<div className="flex items-center justify-between mb-2">
				<div>
					<h1 className="md:text-3xl text-lg font-bold tracking-tight">{materi.nama}</h1>					
				</div>
			</div>

			<div className="container mx-auto max-w-4xl space-y-6">
			<Link
				href="/dashboard/latihan-soal"
				className="inline-flex items-center text-blue-600 hover:text-blue-700"
			>
				<ArrowLeft className="w-4 h-4 mr-2" />
				Back to Material List
			</Link>

			<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
				<div className="flex items-start gap-4 mb-6">
					<div className="bg-blue-500 w-16 h-16 rounded-lg flex items-center justify-center text-white flex-shrink-0">
						<Book className="w-8 h-8" />
					</div>
					<div>
						<h1 className="text-3xl font-bold text-gray-900 mb-2">
							{materi.nama}
						</h1>
						<p className="text-gray-600">
							{materi.deskripsi || 'Practice questions for this material'}
						</p>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-4 mb-8">
					<div className="bg-gray-50 rounded-lg p-4">
						<Target className="w-5 h-5 text-blue-500 mb-2" />
						<div className="text-2xl font-bold text-gray-900">
							{soalList.length}
						</div>
						<div className="text-sm text-gray-600">Total Questions</div>
					</div>
					{/* <div className="bg-gray-50 rounded-lg p-4">
						<Clock className="w-5 h-5 text-green-500 mb-2" />
						<div className="text-2xl font-bold text-gray-900">
							{Math.ceil(soalList.length * 2)}
						</div>
						<div className="text-sm text-gray-600">Menit (Est.)</div>
					</div> */}
					<div className="bg-gray-50 rounded-lg p-4">
						<Book className="w-5 h-5 text-purple-500 mb-2" />
						<div className="text-2xl font-bold text-gray-900">
							{materi.kategori}
						</div>
						<div className="text-sm text-gray-600">Category</div>
					</div>
				</div>

				{/* <div className="mb-6">
					<label className="block text-sm font-medium text-gray-700 mb-3">
						Pilih Mode Latihan
					</label>
					<div className="grid grid-cols-2 gap-4">
						<button
							onClick={() => setSelectedMode('LATIHAN')}
							className={`p-4 rounded-lg border-2 transition-all ${selectedMode === 'LATIHAN'
									? 'border-blue-500 bg-blue-50'
									: 'border-gray-200 hover:border-gray-300'
								}`}
						>
							<div className="font-semibold text-gray-900 mb-1">
								Mode Latihan
							</div>
							<div className="text-sm text-gray-600">
								Belajar dengan pembahasan lengkap
							</div>
						</button>
						<button
							onClick={() => setSelectedMode('TRY_OUT')}
							className={`p-4 rounded-lg border-2 transition-all ${selectedMode === 'TRY_OUT'
									? 'border-blue-500 bg-blue-50'
									: 'border-gray-200 hover:border-gray-300'
								}`}
						>
							<div className="font-semibold text-gray-900 mb-1">
								Mode Try Out
							</div>
							<div className="text-sm text-gray-600">
								Simulasi ujian dengan timer
							</div>
						</button>
					</div>
				</div> */}

				<button
					onClick={handleStartSession}
					disabled={isStarting || soalList.length === 0}
					className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center"
				>
					{isStarting ? (
						<>
							<Loader2 className="w-5 h-5 mr-2 animate-spin" />
							Starting...
						</>
					) : (
						'Start Practice'
					)}
				</button>

				{soalList.length === 0 && (
					<p className="text-center text-red-600 mt-4">
						No questions available for this mode
					</p>
				)}
			</div>
			</div>
		</div>
	);
}