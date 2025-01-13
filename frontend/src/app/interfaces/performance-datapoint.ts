export interface PerformanceDatapoint {
    sid: number;
    year: number;
    competences: Competence[];
}

export interface Competence {
    id: number;
    name: string;
    targetValue: number;
    actualValue: number;
    bonus: number;
    comment: string;
}
