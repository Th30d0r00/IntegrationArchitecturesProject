function calculateBonusPartA(productSales) {
    let bonusA = 0;

    productSales.forEach((product) => {
        product.clients.forEach((client) => {
            const { rating, quantity } = client; 

            const ratingWeight = clientRatingmapping[rating];
            const bonus = quantity * ratingWeight * 8;
            
            client.bonus = bonus; 
            bonusA += bonus; 
        });
    });

    return {
        bonusA,
        productSales
    };
}

function calculateBonusPartB(competences) {
    let bonusB = 0;

    competences.forEach((competence) => {
        const { targetValue, actualValue } = competence;

        let calculatedBonus = Math.floor((Math.pow(actualValue, 2) * 15) / targetValue); 

        competence.bonus = calculatedBonus;

        bonusB += calculatedBonus;
    });

    return {
        bonusB,
        competences
    };
}

const clientRatingmapping = {
    "excellent": 3,
    "very good": 2.5,
    "good": 2,
    "satisfactory": 1.5,
    "sufficient": 1
}

module.exports = {calculateBonusPartA, calculateBonusPartB};

