class PerformanceRecord {
    constructor(sid, year,totalBonus, productSales, competences, ceoApproval = false) {
        this.sid = sid;
        this.year = year;
        this.totalBonus = totalBonus;
        this.productSales = productSales;
        this.competences = competences;
        this.ceoApproval = ceoApproval;
    }
}

module.exports = PerformanceRecord;