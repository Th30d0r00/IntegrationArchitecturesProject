import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import {
    BonusDistribution,
    YearlyBonusStats,
} from 'src/app/interfaces/statistics-datapoint';
import { StatisticsService } from 'src/app/services/statistics.service';

@Component({
    selector: 'app-statistics-page',
    templateUrl: './statistics-page.component.html',
    styleUrls: ['./statistics-page.component.css'],
})
export class StatisticsPageComponent implements OnInit {
    constructor(private statisticsService: StatisticsService) {
        Chart.register(...registerables);
    }

    ngOnInit() {
        this.loadBonusDistribution();
        this.loadYearlyBonusStats();
    }

    private loadBonusDistribution() {
        this.statisticsService.getBonusDistribution().subscribe({
            next: (response) => {
                const distribution = response.body;
                if (distribution) {
                    this.createBonusDistributionChart(distribution);
                }
            },
            error: (error) => {
                console.error('Error loading bonus distribution:', error);
            },
        });
    }

    private loadYearlyBonusStats() {
        this.statisticsService.getYearlyBonusStats().subscribe({
            next: (response) => {
                const stats = response.body;
                if (stats) {
                    this.createYearlyBonusChart(stats);
                }
            },
            error: (error) => {
                console.error('Error loading yearly bonus stats:', error);
            },
        });
    }

    private createBonusDistributionChart(distribution: BonusDistribution) {
        const ctx = document.getElementById(
            'bonusDistributionChart'
        ) as HTMLCanvasElement;
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(distribution),
                datasets: [
                    {
                        label: 'Number of Salesmen',
                        data: Object.values(distribution),
                        backgroundColor: 'rgba(54, 162, 235, 0.5)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1,
                        },
                    },
                },
            },
        });
    }

    private createYearlyBonusChart(stats: YearlyBonusStats) {
        const ctx = document.getElementById(
            'yearlyBonusChart'
        ) as HTMLCanvasElement;
        const years = Object.keys(stats);
        const averages = years.map((year) => stats[year].average);

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: years,
                datasets: [
                    {
                        label: 'Average Bonus Amount (€)',
                        data: averages,
                        fill: false,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        tension: 0.1,
                        pointRadius: 5,
                    },
                ],
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Bonus Amount (€)',
                        },
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Year',
                        },
                    },
                },
            },
        });
    }
}
