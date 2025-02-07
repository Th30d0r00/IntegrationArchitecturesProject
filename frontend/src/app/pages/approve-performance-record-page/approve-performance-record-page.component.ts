import {Component, OnInit} from '@angular/core';
import {PerformanceDatapoint} from '../../interfaces/performance-datapoint';
import {ActivatedRoute, Router} from '@angular/router';
import {SalesmenService} from '../../services/salesmen.service';
import {SalesmenDatapoint} from '../../interfaces/salesmen-datapoint';
import {BonusService} from '../../services/bonus.service';
import {ProductSalesDatapoint} from '../../interfaces/productsSales-datapoint';
import {HttpResponse} from '@angular/common/http';

@Component({
    selector: 'app-approve-performance-record-page',
    templateUrl: './approve-performance-record-page.component.html',
    styleUrls: ['./approve-performance-record-page.component.css']
})
export class ApprovePerformanceRecordPageComponent implements OnInit {

    performanceData: PerformanceDatapoint;
    salesman: SalesmenDatapoint;
    remark = '';
    displayedColumns = ['competence', 'target', 'actual', 'bonus'];
    constructor(
        private route: ActivatedRoute,
        private salesmenService: SalesmenService,
        private bonusService: BonusService,
        private router: Router
    ) {
    }

    async ngOnInit(): Promise<void> {
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

    async fetchSalesmanDetails(sid: number): Promise<void> {
        try {
            const response = await this.salesmenService.getSalesmanById(sid).toPromise();
            this.salesman = response.body;
            console.log(this.salesman);
        } catch (error) {
            console.error('Error fetching salesman details:', error);
            throw error;
        }
    }

    fetchPerformanceData(sid: number, year: number): void {
        this.salesmenService.getSalesmanPerformanceByYear(sid, year).subscribe((response: HttpResponse<PerformanceDatapoint>): void => {
            this.performanceData = response.body;
            console.log(this.performanceData);
        });
    }

    approveRecord(): void {
        if (this.salesman && this.performanceData) {
            const { sid } = this.salesman;
            const { year, totalBonus } = this.performanceData;
            const ceoApproval = true;
            const remark = this.remark;

            this.salesmenService.approvePerformanceRecord(sid, year, ceoApproval, remark).subscribe(
                (response: HttpResponse<any>): void => {
                    console.log('Record approved:', response);
                    alert('Performance Record approved!');

                    this.addBonus(sid, year, totalBonus);
                },
                (error: any): void => {
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
            (bonusError: any): void => {
                console.error('Error updating bonus:', bonusError);
            }
        );
    }

}
