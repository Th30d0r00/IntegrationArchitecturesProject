
export interface Competence {
    id: number;
    name: string;
    targetValue: number;
    actualValue: number;
    bonus: number;
    comment: string;
}

export interface Performance {
    sid: number;
    year: number;
    competences: Competence[];
}

export interface SalesmenDatapoint {
    id: string;
    sid: number;
    lastname: string;
    firstname: string;
    department: string;
    performance: Performance[];
}


