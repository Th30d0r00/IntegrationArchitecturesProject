function calculateBonus(socialPerformanceRecord) {
    let totalBonus = 0;
    socialPerformanceRecord.forEach((record) => {
        const { targetValue, actualValue, bonus } = record;
        if (actualValue >= targetValue) {
            totalBonus += bonus;
        } else {
            const performanceRatio = actualValue / targetValue;
            totalBonus += bonus * performanceRatio;
        }
    });
    return totalBonus;
}
module.exports = {calculateBonus};