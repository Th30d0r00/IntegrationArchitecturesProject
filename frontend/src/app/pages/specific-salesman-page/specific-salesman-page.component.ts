import {Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SalesmenService } from '../../services/salesmen.service';
import { SalesmenDatapoint } from '../../interfaces/salesmen-datapoint';
import {HttpResponse} from '@angular/common/http';

@Component({
    selector: 'app-specific-salesman-page',
    templateUrl: './specific-salesman-page.component.html',
    styleUrls: ['./specific-salesman-page.component.css']
})
export class SpecificSalesmanPageComponent implements OnInit {
    salesman: SalesmenDatapoint;
    displayedColumns = ['year', 'record'];

    constructor(
        private route: ActivatedRoute,
        private salesmenService: SalesmenService
    ) { }

    ngOnInit(): void {
        const sid = this.route.snapshot.paramMap.get('sid');
        console.log(sid);
        if (sid) {
            this.fetchSalesmanDetails(parseInt(sid, 10));
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

}
