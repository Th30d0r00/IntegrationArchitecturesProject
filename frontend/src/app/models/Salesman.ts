export class Salesman {
    constructor(
        public id: string,
        public sid: number,
        public code: number,
        public lastname: string,
        public firstname: string,
        public department: string,
        public performance: Performance[]
    ) { }
}
