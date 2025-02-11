import {Competence} from './Competence';
import {ProductsSales} from './ProductsSales';
import {ApprovalStatus} from './Approval-status';

export class PeformanceRecord {
    constructor(
        public id: string,
        public sid: number,
        public year: number,
        public productSales: ProductsSales[],
        public competences: Competence[],
        public bonusA: number,
        public bonusB: number,
        public totalBonus: number,
        public approvalStatus: ApprovalStatus,
        public remark: string
    ) { }
}

