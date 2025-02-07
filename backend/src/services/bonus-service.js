// Nochmal drüber diskutieren, ob das so passt. GGf. Berechnung verändern

function calculateBonusPartA(productSales) {

    let bonusA = 0;

    productSales.forEach((product) => {
        product.clients.forEach((client) => {
            const { rating } = client;
            const bonus = clientRatingmapping[rating];
            client.bonus = bonus;
            bonusA += bonus;
        });
    });

    return {
        bonusA: bonusA,
        productSales
    };

}

function calculateBonusPartB(competences) {
    let bonusB = 0;

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

        bonusB += calculatedBonus;
    });

    return {
        bonusB: Math.round(bonusB),
        competences
    };
}

clientRatingmapping = {
    "excellent": 700,
    "very good": 500,
    "good": 200,
    "satisfactory": 100,
    "sufficient": 50,
}

module.exports = {calculateBonusPartA, calculateBonusPartB};

