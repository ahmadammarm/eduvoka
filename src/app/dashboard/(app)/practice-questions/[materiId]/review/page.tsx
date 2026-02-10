import { prisma } from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import ReviewClient from './ReviewClient';


interface ReviewPageProps {
    params: Promise<{
        materiId: string;
    }>;
    searchParams: Promise<{
        sessionId?: string;
    }>;
}


export default async function ReviewPage({ params, searchParams }: ReviewPageProps) {
    // Next.js 15: params and searchParams are Promises
    const { materiId } = await params;
    const { sessionId } = await searchParams;

    if (!sessionId) {
        redirect(`/dashboard/practice-questions/${materiId}`);
    }

    // Fetch session result
    const session = await prisma.latihanSession.findUnique({
        where: { id: sessionId },
        include: {
            jawaban: {
                include: {
                    soalLatihan: {
                        include: {
                            pilihanJawaban: {
                                orderBy: { label: 'asc' as const }
                            }
                        }
                    },
                    pilihanJawaban: true // Correct relation name
                }
            }
        }
    });

    if (!session) {
        notFound();
    }

    // Calculate stats
    const totalQuestions = session.jawaban.length;
    const correctAnswers = session.jawaban.filter((j: any) => j.isCorrect === true).length;
    const wrongAnswers = session.jawaban.filter((j: any) => j.isCorrect === false).length;
    const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

    // Prepare review data
    const reviewData = {
        sessionId: session.id,
        materiId,
        score,
        totalQuestions,
        correctAnswers,
        wrongAnswers,
        questions: session.jawaban.map((jawaban: any) => ({
            soalId: jawaban.soalLatihanId,
            content: jawaban.soalLatihan.content,
            choices: jawaban.soalLatihan.pilihanJawaban.map((p: any) => ({
                label: p.label,
                pilihan: p.pilihan
            })),
            userAnswer: jawaban.pilihanId,
            userAnswerLabel: jawaban.pilihanJawaban?.label || null,
            correctAnswer: jawaban.soalLatihan.kunciJawaban,
            isCorrect: jawaban.isCorrect,
            isSkipped: jawaban.isSkipped,
            timeSpent: jawaban.timeSpent
        }))
    };

    return <ReviewClient reviewData={reviewData} />;
}
