import {Competence} from './Competence';

export class PeformanceRecord {
    constructor(
        public id: string,
        public sid: number,
        public year: number,
        public competences: Competence[],
        public totalBonus: number,
        public ceoApproval: boolean,
        public remark: string
    ) { }
}

