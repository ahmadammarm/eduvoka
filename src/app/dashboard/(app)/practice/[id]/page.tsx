import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import PracticeClient from './PracticeClient';

interface PracticePageProps {
    params: {
        id: string;
    };
}

export default async function PracticePage({ params }: PracticePageProps) {
    const { id } = params;

    // Fetch question data from database
    const question = await prisma.soalLatihanSoal.findUnique({
        where: { id },
        include: {
            pilihanJawaban: {
                orderBy: { label: 'asc' }
            }
        }
    });

    if (!question) {
        notFound();
    }

    // Prepare question data for client
    const questionData = {
        id: question.id,
        content: question.content,
        type: question.tipe,
        correctAnswer: question.kunciJawaban,
        choices: question.pilihanJawaban.map(choice => ({
            label: choice.label,
            pilihan: choice.pilihan
        }))
    };

    // Determine topic name from question type
    const topicNames: Record<string, string> = {
        'PU': 'Penalaran Umum',
        'PBM': 'Pemahaman Bacaan & Menulis',
        'PPU': 'Pengetahuan & Pemahaman Umum',
        'PK': 'Penalaran Kuantitatif',
        'LITERASIBINDO': 'Literasi Bahasa Indonesia',
        'LITERASIBINGG': 'Literasi Bahasa Inggris'
    };

    const topicName = topicNames[question.tipe] || question.tipe;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 p-4">
            <div className="max-w-7xl mx-auto">
                <PracticeClient
                    question={questionData}
                    topicName={topicName}
                />
            </div>
        </div>
    );
}
