import {ProductsSales} from '../models/ProductsSales';

export interface PerformanceDatapoint {
    sid: number;
    year: number;
    productSales: ProductsSales[];
    competences: Competence[];
    bonusA: number;
    bonusB: number;
    totalBonus: number;
    remark: string;
    ceoApproval: boolean;
}

export interface Competence {
    id: number;
    name: string;
    targetValue: number;
    actualValue: number;
    bonus: number;
}
