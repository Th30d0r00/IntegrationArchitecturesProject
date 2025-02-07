import {Competence} from './Competence';
import {ProductsSales} from './ProductsSales';

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
        public ceoApproval: boolean,
        public remark: string
    ) { }
}

