export interface PerformanceDatapoint {
    sid: number;
    year: number;
    competences: Competence[];
    totalBonus: number;
}

export interface Competence {
    id: number;
    name: string;
    targetValue: number;
    actualValue: number;
    bonus: number;
    comment: string;
}
