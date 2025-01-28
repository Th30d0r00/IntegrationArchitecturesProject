// Nochmal drüber diskutieren, ob das so passt. GGf. Berechnung verändern
function calculateBonus(competences) {
    let totalBonus = 0;

    competences.forEach((competence) => {
        const { targetValue, actualValue } = competence;

        let calculatedBonus = 0;

        if (actualValue >= targetValue) {
            calculatedBonus = 100;
        } else {
            const performanceRatio = actualValue / targetValue;
            calculatedBonus = 100 * performanceRatio;
        }

        competence.bonus = Math.round(calculatedBonus);

        totalBonus += calculatedBonus;
    });

    return {
        totalBonus: Math.round(totalBonus),
        competences
    };
}
module.exports = {calculateBonus};