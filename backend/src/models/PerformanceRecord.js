class PerformanceRecord {
    constructor(sid, year,totalBonus, competences, ceoApproval = false) {
        this.sid = sid;
        this.year = year;
        this.totalBonus = totalBonus;
        this.competences = competences;
        this.ceoApproval = ceoApproval;
    }
}

module.exports = PerformanceRecord;