import {Component, OnInit} from '@angular/core';
import {SalesmenService} from '../../services/salesmen.service';
import {SalesmenDatapointWithPerformanceYear} from '../../interfaces/salesmen-datapoint-performance-year';

@Component({
    selector: 'app-performance-record-approval-list-page',
    templateUrl: './performance-record-approval-list-page.component.html',
    styleUrls: ['./performance-record-approval-list-page.component.css']
})
export class PerformanceRecordApprovalListPageComponent implements OnInit {

    displayedColumns = ['firstname', 'lastname', 'id', 'department', 'year', 'records'];
    salesmen: SalesmenDatapointWithPerformanceYear[] = [];
    constructor(private salesmenService: SalesmenService) { }

    ngOnInit(): void {
        this.fetchSalesmen();
    }

    fetchSalesmen(): void {
        this.salesmenService.getSalesmenWithUnapprovedRecords().subscribe((response): void => {
            console.log(response.body);
            if (response.status === 200 && response.body) {
                this.salesmen = response.body;
            } else {
                this.salesmen = [];
            }
            console.log(this.salesmen);
        });
    }

}
