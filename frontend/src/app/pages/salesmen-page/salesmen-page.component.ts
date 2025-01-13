import {Component, OnInit} from '@angular/core';
import {SalesmenService} from '../../services/salesmen.service';
import {SalesmenDatapoint} from '../../interfaces/salesmen-datapoint';

@Component({
    selector: 'app-salesmen-page',
    templateUrl: './salesmen-page.component.html',
    styleUrls: ['./salesmen-page.component.css']
})
export class SalesmenPageComponent implements OnInit {

    displayedColumns = ['firstname', 'lastname', 'id', 'department', 'details'];
    salesmen: SalesmenDatapoint[] = [];

    constructor(private salesmenService: SalesmenService) { }

    ngOnInit(): void {
        this.fetchSalesmen();
    }

    fetchSalesmen(): void {
        this.salesmenService.getSalesmen().subscribe((response): void => {
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
