'use client';


import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BookOpen, Search, Plus, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Materi {
	id: string;
	nama: string;
	deskripsi: string;
	kategori: string;
	createdAt: string;
}

export default function MateriPage() {
	const [materis, setMateris] = useState<Materi[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState('');

	const router = useRouter();

	useEffect(() => {
		fetchMateris();
	}, []);

	const fetchMateris = async () => {
		try {
			const response = await fetch('/api/materi');
			const data = await response.json();
			setMateris(data);
		} catch (error) {
			console.error('Error fetching materis:', error);
		} finally {
			setLoading(false);
		}
	};

	const filteredMateris = materis.filter((materi) =>
		materi.nama?.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const handleDetailMateri = (materiId: string) => {
		router.push(`/dashboard/materi/${materiId}`);
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<Loader2 className="w-8 h-8 animate-spin text-primary" />
			</div>
		);
	}

	return (
		<div className="container mx-auto p-6 space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Materi Pembelajaran</h1>
					<p className="text-muted-foreground mt-2">
						Kelola dan akses materi pembelajaran Anda
					</p>
				</div>
				<Button>
					<Plus className="w-4 h-4 mr-2" />
					Tambah Materi
				</Button>
			</div>

			<div className="relative">
				<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
				<Input
					placeholder="Cari materi..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="pl-10"
				/>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{filteredMateris.map((materi) => (
					<Card key={materi.id} className="hover:shadow-lg transition-shadow">
						<CardHeader>
							<div className="flex items-start gap-3">
								<div className="p-2 bg-primary/10 rounded-lg">
									<BookOpen className="w-5 h-5 text-primary" />
								</div>
								<div className="flex-1">
									<CardTitle className="line-clamp-1">{materi.nama}</CardTitle>
									<CardDescription className="mt-1">
										{new Date(materi.createdAt).toLocaleDateString('id-ID')}
									</CardDescription>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-muted-foreground line-clamp-3 mb-4">
								{materi.deskripsi}
							</p>
							<Button variant="outline" className="w-full" onClick={handleDetailMateri.bind(null, materi.id)}>
								Lihat Detail
							</Button>
						</CardContent>
					</Card>
				))}
			</div>

			{filteredMateris.length === 0 && (
				<div className="text-center py-12">
					<BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
					<h3 className="text-lg font-semibold">Tidak ada materi ditemukan</h3>
					<p className="text-muted-foreground mt-2">
						{searchQuery ? 'Coba kata kunci lain' : 'Mulai dengan menambahkan materi baru'}
					</p>
				</div>
			)}
		</div>
	);
}