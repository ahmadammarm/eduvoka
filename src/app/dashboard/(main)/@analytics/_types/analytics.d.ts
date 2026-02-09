export interface DailyActivity {
    date: string;
    sessionsCount: number;
    questionsAnswered: number;
    correctAnswers: number;
    totalStudyMinutes: number;
    accuracy: number;
    latihanMinutes: number;
    materiMinutes: number;
    latihanSessions: number;
    materiSessions: number;
}

export interface SubjectPerformance {
    kategori: string;
    kategoriLabel: string;
    totalQuestions: number;
    correctAnswers: number;
    accuracy: number;
    avgTimePerQuestion: number;
    sessionsCount: number;
}

export interface RecentSession {
    id: string;
    type: 'LATIHAN' | 'STUDY';
    materiName: string;
    kategori: string;
    startedAt: string;
    score: number | null;
    accuracy: number | null;
    totalDuration: number | null;
    totalQuestions: number;
}

export interface StudyTimeDistribution {
    hour: number;
    totalMinutes: number;
    sessionsCount: number;
}

export interface OverviewStats {
    totalSessions: number;
    totalQuestionsAnswered: number;
    overallAccuracy: number;
    totalStudyMinutes: number;
    currentStreak: number;
    bestStreak: number;
    avgSessionDuration: number;
    improvementRate: number;
}

export interface AnalyticsData {
    overview: OverviewStats;
    dailyActivity: DailyActivity[];
    subjectPerformance: SubjectPerformance[];
    recentSessions: RecentSession[];
    studyTimeDistribution: StudyTimeDistribution[];

	burnoutTrend: BurnoutTrend;
}

export interface BurnoutTrend {
	avgBurnoutIndex: number;
	distribution: Record<BurnoutLevel, number>;
	trend: 'IMPROVING' | 'WORSENING' | 'STABLE';
	recentSessions: Array<{
		date: string;
		burnoutLevel: BurnoutLevel;
		fatigueIndex: number;
	}>;
}