import {ProductsSales} from '../models/ProductsSales';
import {ApprovalStatus} from '../models/Approval-status';

export interface PerformanceDatapoint {
    sid: number;
    year: number;
    productSales: ProductsSales[];
    competences: Competence[];
    bonusA: number;
    bonusB: number;
    totalBonus: number;
    remark: string;
    approvalStatus: ApprovalStatus;
}

export interface Competence {
    id: number;
    name: string;
    targetValue: number;
    actualValue: number;
    bonus: number;
}
