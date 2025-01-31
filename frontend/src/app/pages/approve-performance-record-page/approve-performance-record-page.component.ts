import {Component, OnInit} from '@angular/core';
import {PerformanceDatapoint} from '../../interfaces/performance-datapoint';
import {ActivatedRoute, Router} from '@angular/router';
import {SalesmenService} from '../../services/salesmen.service';
import {SalesmenDatapoint} from '../../interfaces/salesmen-datapoint';
import {BonusService} from '../../services/bonus.service';

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

    ngOnInit(): void {
        const sid = this.route.snapshot.paramMap.get('sid');
        const year = this.route.snapshot.paramMap.get('year');
        if (sid && year) {
            this.fetchSalesmanDetails(parseInt(sid, 10));
            this.fetchPerformanceData(parseInt(sid, 10), parseInt(year, 10));
        }
    }

    fetchSalesmanDetails(sid: number): void {
        this.salesmenService.getSalesmanById(sid).subscribe((response) => {
            this.salesman = response.body;
            console.log(this.salesman);
        });
    }

    fetchPerformanceData(sid: number, year: number): void {
        this.salesmenService.getSalesmanPerformanceByYear(sid, year).subscribe((response) => {
            this.performanceData = response.body;
            console.log(this.performanceData);
        });
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type
    approveRecord(): void {
        if (this.salesman && this.performanceData) {
            const { sid } = this.salesman;
            const { year, totalBonus } = this.performanceData;
            const ceoApproval = true;
            const remark = this.remark;

            // Genehmigung des Performance Records
            this.salesmenService.approvePerformanceRecord(sid, year, ceoApproval, remark).subscribe(
                (response) => {
                    console.log('Record approved:', response);
                    alert('Performance Record approved!');

                    this.addBonus(sid, year, totalBonus);
                },
                (error) => {
                    console.error('Error approving record:', error);
                }
            );
        }
    }

    private addBonus(sid: number, year: number, bonus: number): void {
        this.bonusService.addBonus(sid, year, bonus).subscribe(
            (bonusResponse) => {
                console.log('Bonus updated:', bonusResponse);
                this.router.navigate(['/approval-list']);
            },
            (bonusError) => {
                console.error('Error updating bonus:', bonusError);
            }
        );
    }

}
