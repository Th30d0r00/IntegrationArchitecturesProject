import {Component, OnInit} from '@angular/core';
import {PerformanceDatapoint} from '../../interfaces/performance-datapoint';
import {ActivatedRoute} from '@angular/router';
import {SalesmenService} from '../../services/salesmen.service';
import {SalesmenDatapoint} from "../../interfaces/salesmen-datapoint";

@Component({
    selector: 'app-performance-record-page',
    templateUrl: './performance-record-page.component.html',
    styleUrls: ['./performance-record-page.component.css']
})
export class PerformanceRecordPageComponent implements OnInit {

    performanceData: PerformanceDatapoint;
    salesman: SalesmenDatapoint;
    displayedColumns = ['competence', 'target', 'actual', 'bonus'];
    constructor(
        private route: ActivatedRoute,
        private salesmenService: SalesmenService
    ) { }

    ngOnInit(): void {
        const sid = this.route.snapshot.paramMap.get('sid');
        const year = this.route.snapshot.paramMap.get('year');
        if (sid && year) {
            this.fetchPerformanceData(parseInt(sid, 10), parseInt(year, 10));
            this.fetchSalesmanDetails(parseInt(sid, 10));
        }
    }

    fetchPerformanceData(sid: number, year: number): void {
        this.salesmenService.getSalesmanPerformanceByYear(sid, year).subscribe((response) => {
            this.performanceData = response.body;
            console.log(this.performanceData);
        });
    }
    fetchSalesmanDetails(sid: number): void {
        this.salesmenService.getSalesmanById(sid).subscribe((response) => {
            this.salesman = response.body;
            console.log(this.salesman);
        });
    }


}
