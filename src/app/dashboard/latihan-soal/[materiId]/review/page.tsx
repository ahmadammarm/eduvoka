import { prisma } from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import ReviewClient from './ReviewClient';

interface ReviewPageProps {
    params: {
        materiId: string;
    };
    searchParams: {
        sessionId?: string;
    };
}

export default async function ReviewPage({ params, searchParams }: ReviewPageProps) {
    const { materiId } = params;
    const { sessionId } = searchParams;

    if (!sessionId) {
        redirect(`/dashboard/latihan-soal/${materiId}`);
    }

    // Fetch session result
    const session = await prisma.latihanSession.findUnique({
        where: { id: sessionId },
        include: {
            jawabanUser: {
                include: {
                    soalLatihan: {
                        include: {
                            pilihanJawaban: {
                                orderBy: { label: 'asc' as const }
                            }
                        }
                    },
                    pilihan: true
                }
            }
        }
    });

    if (!session) {
        notFound();
    }

    // Calculate stats
    const totalQuestions = session.jawabanUser.length;
    const correctAnswers = session.jawabanUser.filter(j => j.isCorrect === true).length;
    const wrongAnswers = session.jawabanUser.filter(j => j.isCorrect === false).length;
    const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

    // Prepare review data
    const reviewData = {
        sessionId: session.id,
        materiId,
        score,
        totalQuestions,
        correctAnswers,
        wrongAnswers,
        questions: session.jawabanUser.map(jawaban => ({
            soalId: jawaban.soalLatihanId,
            content: jawaban.soalLatihan.content,
            choices: jawaban.soalLatihan.pilihanJawaban.map(p => ({
                label: p.label,
                pilihan: p.pilihan
            })),
            userAnswer: jawaban.pilihanId,
            userAnswerLabel: jawaban.pilihan?.label || null,
            correctAnswer: jawaban.soalLatihan.kunciJawaban,
            isCorrect: jawaban.isCorrect,
            isSkipped: jawaban.isSkipped,
            timeSpent: jawaban.timeSpent
        }))
    };

    return <ReviewClient reviewData={reviewData} />;
}
