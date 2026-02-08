export type BurnoutLevel = 'NONE' | 'MILD' | 'MODERATE' | 'SEVERE';
export type NextAction = 'CONTINUE' | 'SWITCH_TOPIC' | 'STOP_SESSION' | 'REST';

export interface AnswerData {
	timeSpent: number;
	isCorrect: boolean;
	isSkipped: boolean;
	answeredAt: Date;
}

export interface BurnoutComponent {
	value: number;
	weight: number;
	contribution: number;
	interpretation: string;
}

export interface QuartileStats {
	avgTime: number;
	accuracy: number;
	skipRate: number;
}

export interface BurnoutRecommendation {
	shouldRest: boolean;
	restDuration: number; // minutes
	message: string;
	nextAction: NextAction;
}

export interface SessionStats {
	totalQuestions: number;
	totalDuration: number; // seconds
	avgTimePerQ: number;
	accuracyRate: number;
	skipRate: number;
	quartiles: {
		q1: QuartileStats;
		q2: QuartileStats;
		q3: QuartileStats;
	};
}

export interface BurnoutCalculationResult {
	burnoutLevel: BurnoutLevel;
	fatigueIndex: number;
	components: {
		cognitiveLoad: BurnoutComponent;
		decisionQuality: BurnoutComponent;
		engagement: BurnoutComponent;
		consistency: BurnoutComponent;
	};
	recommendations: BurnoutRecommendation;
	sessionStats: SessionStats;
}

export interface BurnoutCalculationInput {
	sessionId: string;
	userId: string;
	answers: AnswerData[];
}

export interface ValidationResult {
	valid: boolean;
	reason?: string;
}