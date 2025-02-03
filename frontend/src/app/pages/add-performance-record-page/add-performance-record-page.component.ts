import {Component, OnInit} from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { SalesmenService } from '../../services/salesmen.service';
import {ActivatedRoute, Router} from '@angular/router';
import {SalesmenDatapoint} from '../../interfaces/salesmen-datapoint';
import {Competence} from '../../models/Competence';
import {PeformanceRecord} from '../../models/PeformanceRecord';
import {ProductSalesDatapoint} from "../../interfaces/productsSales-datapoint";
import {ProductsSales} from "../../models/ProductsSales";
import {ClientPurchase} from "../../models/ClientPurchase";

@Component({
    selector: 'app-add-performance-record-page',
    templateUrl: './add-performance-record-page.component.html',
    styleUrls: ['./add-performance-record-page.component.css']
})
export class AddPerformanceRecordPageComponent implements OnInit {
    recordForm: FormGroup;
    salesman: SalesmenDatapoint;
    salesOrders: ProductSalesDatapoint[];

    competences = [
        { id: 1, name: 'Leadership', targetValue: 4 },
        { id: 2, name: 'Openness to Employee', targetValue: 4 },
        { id: 3, name: 'Social Behavior to Employee', targetValue: 4 },
        { id: 4, name: 'Attitude towards Client', targetValue: 4 },
        { id: 5, name: 'Communication Skill', targetValue: 4 },
        { id: 6, name: 'Integrity towards Company', targetValue: 4 }
    ];

    constructor(
        private salesmenService: SalesmenService,
        private route: ActivatedRoute,
        private router: Router) {
    }

    ngOnInit(): void {
        this.initializeForm();
        console.log(this.recordForm);
        const sid = this.route.snapshot.paramMap.get('sid');
        if (sid) {
            this.fetchSalesmanDetails(parseInt(sid, 10));
        }
    }

    private initializeForm(): void {
        this.recordForm = new FormGroup({
            year: new FormControl(new Date().getFullYear(), [Validators.required, Validators.min(2000), Validators.max(2099)]),
            competences: new FormArray(this.competences.map(competence => new FormGroup({
                name: new FormControl(competence.name),
                targetValue: new FormControl(competence.targetValue),
                actualValue: new FormControl('', [Validators.required, Validators.min(0), Validators.max(4)])
            })))
        });
    }

    get competencesControls(): FormGroup[] {
        return (this.recordForm.get('competences') as FormArray).controls as FormGroup[];
    }


    onSubmit(): void {
        this.savePerformanceRecord();
    }

    fetchSalesmanDetails(sid: number): void {
        this.salesmenService.getSalesmanById(sid).subscribe((response) => {
            this.salesman = response.body;
            console.log(this.salesman);
        });
    }

    fetchOrderDetails(gid: number, year: number): void {
        this.salesmenService.getSalesOrdersByGovernmentIdAndYear(gid, year).subscribe((response) => {
            this.salesOrders = response.body;
            console.log('Sales Orders:', this.salesOrders);
            console.log(response.body);
        });
    }

    savePerformanceRecord(): void {
        if (this.recordForm.valid) {
            const sid = this.route.snapshot.paramMap.get('sid');
            if (sid) {
                const year = this.recordForm.get('year')?.value;

                // Mapping der Competences
                const competences: Competence[] = this.competencesControls.map(competence => new Competence(
                    '',                         // Ersetze das leere String mit der tatsächlichen ID, falls nötig
                    competence.value.name,
                    competence.value.targetValue,
                    competence.value.actualValue,
                    0
                ));

                // Mapping der Sales Orders zu ProductsSales
                const productsSales = this.salesOrders.map(order => new ProductsSales(
                    order.productId,
                    order.productName,
                    order.productDescription,
                    order.clients.map(client => new ClientPurchase(
                        client.customerName,
                        client.rating,
                        client.quantity
                    )) // Mappe die Clients zu ClientPurchase
                ));

                console.log('ProductsSales:', productsSales);

                // Erstelle das PerformanceRecord-Objekt
                const performanceRecord = new PeformanceRecord(
                    '',                          // ID ist leer, es wird beim Hinzufügen durch API erstellt
                    parseInt(sid, 10),            // Salesman ID (sid)
                    year,                         // Jahr
                    productsSales,                // ProductsSales (Array)
                    competences,                  // Competences (Array)
                    0,                            // Total Bonus
                    false,                        // CEO Approval (Standardmäßig false)
                    ''                            // Remark (Leer, bis später definiert)
                );

                console.log(performanceRecord);

                // Speichern des PerformanceRecords
                this.salesmenService.addPerformanceRecord(parseInt(sid, 10), performanceRecord).subscribe(response => {
                    console.log('API Response:', response);
                    alert('Performance record added!');
                    this.router.navigate(['/salesmen', sid]);
                });
            }
        }
    }


    onGetOrderEvaluation(): void {
        const year = this.recordForm.get('year')?.value;
        if (this.salesman && this.salesman.code) {
            // fetchOrderDetails mit dem governmentId (code) und Jahr aus der Formulardaten
            this.fetchOrderDetails(this.salesman.code, year);
        }
    }
}
