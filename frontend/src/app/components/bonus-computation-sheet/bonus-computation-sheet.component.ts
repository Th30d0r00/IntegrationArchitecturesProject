import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SalesmenService } from '../../services/salesmen.service';
import { BonusService } from '../../services/bonus.service';
import { SalesmenDatapoint } from '../../interfaces/salesmen-datapoint';
import { PerformanceDatapoint } from '../../interfaces/performance-datapoint';
import { HttpResponse } from '@angular/common/http';

@Component({
    selector: 'app-bonus-computation-sheet',
    templateUrl: './bonus-computation-sheet.component.html',
    styleUrls: ['./bonus-computation-sheet.component.css']
})
export class BonusComputationSheetComponent implements OnInit {
    @Input() performanceData: PerformanceDatapoint;
    @Input() salesman: SalesmenDatapoint;
    @Input() isApprovalPage = false;

    remark = '';

    constructor(
        private route: ActivatedRoute,
        private salesmenService: SalesmenService,
        private bonusService: BonusService,
        private router: Router
    ) {}

    async ngOnInit(): Promise<void> {
        if (!this.performanceData || !this.salesman) {
            const sid = this.route.snapshot.paramMap.get('sid');
            const year = this.route.snapshot.paramMap.get('year');

            if (sid && year) {
                try {
                    await this.fetchSalesmanDetails(parseInt(sid, 10));
                    this.fetchPerformanceData(parseInt(sid, 10), parseInt(year, 10));
                    console.log('All data fetched');
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
        }
    }

    async fetchSalesmanDetails(sid: number): Promise<void> {
        try {
            const response = await this.salesmenService.getSalesmanById(sid).toPromise();
            this.salesman = response.body;
            console.log('Salesman data:', this.salesman);
        } catch (error) {
            console.error('Error fetching salesman details:', error);
        }
    }

    fetchPerformanceData(sid: number, year: number): void {
        this.salesmenService.getSalesmanPerformanceByYear(sid, year).subscribe(
            (response: HttpResponse<PerformanceDatapoint>): void => {
                this.performanceData = response.body;
                console.log('Performance data:', this.performanceData);
            },
            (error): void => {
                console.error('Error fetching performance data:', error);
            }
        );
    }

    approveRecord(): void {
        if (this.salesman && this.performanceData) {
            const { sid } = this.salesman;
            const { year, totalBonus } = this.performanceData;
            const ceoApproval = true;

            this.salesmenService.approvePerformanceRecord(sid, year, ceoApproval, this.remark).subscribe(
                (response: HttpResponse<any>): void => {
                    console.log('Record approved:', response);
                    alert('Performance Record approved!');
                    this.addBonus(sid, year, totalBonus);
                },
                (error): void => {
                    console.error('Error approving record:', error);
                }
            );
        }
    }

    private addBonus(sid: number, year: number, bonus: number): void {
        this.bonusService.addBonus(sid, year, bonus).subscribe(
            (bonusResponse: HttpResponse<any>): void => {
                console.log('Bonus updated:', bonusResponse);
                void this.router.navigate(['/approval-list']);
            },
            (bonusError): void => {
                console.error('Error updating bonus:', bonusError);
            }
        );
    }
}
