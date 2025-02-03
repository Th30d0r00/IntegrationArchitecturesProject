import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SalesmenService } from '../../services/salesmen.service';
import { SalesmenDatapoint } from '../../interfaces/salesmen-datapoint';
import { ProductSalesDatapoint } from '../../interfaces/productsSales-datapoint';
import { PerformanceDatapoint } from '../../interfaces/performance-datapoint';

@Component({
    selector: 'app-performance-record-page',
    templateUrl: './performance-record-page.component.html',
    styleUrls: ['./performance-record-page.component.css']
})
export class PerformanceRecordPageComponent implements OnInit {

    performanceData: PerformanceDatapoint;
    salesman: SalesmenDatapoint;
    salesOrders: ProductSalesDatapoint[];
    displayedColumns = ['competence', 'target', 'actual', 'bonus'];

    constructor(
        private route: ActivatedRoute,
        private salesmenService: SalesmenService
    ) { }

    async ngOnInit(): Promise<void> {
        const sid = this.route.snapshot.paramMap.get('sid');
        const year = this.route.snapshot.paramMap.get('year');

        if (sid && year) {
            try {
                const salesmanResponse = await this.salesmenService.getSalesmanById(parseInt(sid, 10)).toPromise();
                this.salesman = salesmanResponse.body;

                console.log(this.salesman); // Debugging

                this.fetchPerformanceData(parseInt(sid, 10), parseInt(year, 10));

                this.fetchSalesOrders(this.salesman.code, parseInt(year, 10));
                console.log(this.salesOrders);
                console.log('All data fetched');
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
    }

    fetchPerformanceData(sid: number, year: number): void {
        this.salesmenService.getSalesmanPerformanceByYear(sid, year).subscribe((response) => {
            this.performanceData = response.body;
        });
    }

    fetchSalesOrders(governmentId: number, year: number): void {
        this.salesmenService.getSalesOrdersByGovernmentIdAndYear(governmentId, year).subscribe((response) => {
            this.salesOrders = response.body;
            console.log(this.salesOrders); // Debugging
        });
    }
}
