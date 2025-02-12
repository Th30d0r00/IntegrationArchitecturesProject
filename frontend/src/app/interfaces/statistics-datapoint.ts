export interface BonusDistribution {
    '0-500€': number;
    '501-1000€': number;
    '1001-1500€': number;
    '1500€+': number;
}

export interface YearlyBonusStats {
    [year: string]: {
        average: number;
    };
}
