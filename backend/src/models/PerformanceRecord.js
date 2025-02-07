class PerformanceRecord {
    constructor(sid, year, bonusA, bonusB, totalBonus, productSales, competences, ceoApproval = false) {
        this.sid = sid;
        this.year = year;
        this.bonusA = bonusA;
        this.bonusB = bonusB;
        this.totalBonus = totalBonus
        this.productSales = productSales;
        this.competences = competences;
        this.ceoApproval = ceoApproval;
    }
}

module.exports = PerformanceRecord;