export class Competence {
    constructor(
        public id: string,
        public name: string,
        public targetValue: number,
        public actualValue: number,
        public bonus: number,
        public remark: string
    ) { }
}
