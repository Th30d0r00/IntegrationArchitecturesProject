import {Component, Input, OnInit} from '@angular/core';
import {SalesmenDatapoint} from '../../interfaces/salesmen-datapoint';
import {ActivatedRoute} from '@angular/router';
import {SalesmenService} from '../../services/salesmen.service';
import {HttpResponse} from '@angular/common/http';
import {UserService} from '../../services/user.service';
import {User} from '../../models/User';
import {PerformanceDatapoint} from '../../interfaces/performance-datapoint';
import {ApprovalStatus} from "../../models/Approval-status";

@Component({
    selector: 'app-performance-records-view',
    templateUrl: './performance-records-view.component.html',
    styleUrls: ['./performance-records-view.component.css']
})
export class PerformanceRecordsViewComponent implements OnInit{
    @Input() salesman: SalesmenDatapoint;
    @Input() performanceData: PerformanceDatapoint[];
    @Input() isHrView = false;
    displayedColumns = ['year', 'record'];

    constructor(
        private route: ActivatedRoute,
        private salesmenService: SalesmenService,
        private userService: UserService
    ) { }

    ngOnInit(): void {
        if (this.isHrView) {
            const sid = parseInt(this.route.snapshot.paramMap.get('sid') || '0', 10);
            this.fetchSalesmanDetails(sid);
            console.log(sid);
            this.fetchAllPerformanceData(sid);
        } else {
            this.userService.getOwnUser().subscribe((userdata: User): void => {
                const sid = userdata.sid;
                console.log(sid);
                this.fetchSalesmanDetails(sid);
                this.fetchApprovedPerformanceData(sid);
            });
        }
    }


    fetchSalesmanDetails(sid: number): void {
        this.salesmenService.getSalesmanById(sid).subscribe(
            (response: HttpResponse<SalesmenDatapoint>): void => {
                this.salesman = response.body;
                console.log(this.salesman);
            }
        );
    }

    fetchApprovedPerformanceData(sid: number): void {
        this.salesmenService.getApprovedPerformanceRecords(sid).subscribe(
            (response: HttpResponse<PerformanceDatapoint[]>): void => {
                this.performanceData = response.body;
                console.log(this.performanceData);
            }
        );
    }

    fetchAllPerformanceData(sid: number): void {
        this.salesmenService.getPerformanceRecords(sid).subscribe(
            (response: HttpResponse<PerformanceDatapoint[]>): void => {
                this.performanceData = response.body;
                console.log(this.performanceData);
            }
        );
    }


    protected readonly ApprovalStatus = ApprovalStatus;
}
