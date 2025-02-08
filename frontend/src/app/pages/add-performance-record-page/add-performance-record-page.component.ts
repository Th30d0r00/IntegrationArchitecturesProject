import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { SalesmenService } from '../../services/salesmen.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SalesmenDatapoint } from '../../interfaces/salesmen-datapoint';
import { Competence } from '../../models/Competence';
import { PeformanceRecord } from '../../models/PeformanceRecord';
import { ProductSalesDatapoint } from '../../interfaces/productsSales-datapoint';
import { ProductsSales } from '../../models/ProductsSales';
import { ClientPurchase } from '../../models/ClientPurchase';
import { HttpResponse } from '@angular/common/http';

@Component({
    selector: 'app-add-performance-record-page',
    templateUrl: './add-performance-record-page.component.html',
    styleUrls: ['./add-performance-record-page.component.css'],
})
export class AddPerformanceRecordPageComponent implements OnInit {
    recordForm: FormGroup;
    salesman: SalesmenDatapoint;
    salesOrders: ProductSalesDatapoint[];

    competences = [
        { id: 1, name: 'Leadership', targetValue: 5 },
        { id: 2, name: 'Openness to Employee', targetValue: 5 },
        { id: 3, name: 'Social Behavior to Employee', targetValue: 5 },
        { id: 4, name: 'Attitude towards Client', targetValue: 5 },
        { id: 5, name: 'Communication Skill', targetValue: 5 },
        { id: 6, name: 'Integrity towards Company', targetValue: 5 },
    ];

    constructor(
        private salesmenService: SalesmenService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.initializeForm();
        console.log(this.recordForm);
        const sid = this.route.snapshot.paramMap.get('sid');
        if (sid) {
            this.fetchSalesmanDetails(parseInt(sid, 10)).then(() => {
                this.onGetOrderEvaluation();
            });
        }
    }

    private initializeForm(): void {
        this.recordForm = new FormGroup({
            year: new FormControl(new Date().getFullYear()),
            competences: new FormArray(
                this.competences.map((competence): FormGroup => {
                    const targetValueControl = new FormControl(
                        competence.targetValue
                    );
                    const actualValueControl = new FormControl('', [
                        Validators.required,
                        Validators.min(0),
                        Validators.max(competence.targetValue),
                    ]);
                    targetValueControl.valueChanges.subscribe(
                        (newTargetValue) => {
                            actualValueControl.setValidators([
                                Validators.required,
                                Validators.min(0),
                                Validators.max(newTargetValue),
                            ]);
                            actualValueControl.updateValueAndValidity();
                        }
                    );

                    return new FormGroup({
                        name: new FormControl(competence.name),
                        targetValue: targetValueControl,
                        actualValue: actualValueControl,
                    });
                })
            ),
        });
    }

    get competencesControls(): FormGroup[] {
        return (this.recordForm.get('competences') as FormArray)
            .controls as FormGroup[];
    }

    onSubmit(): void {
        this.savePerformanceRecord();
    }

    async fetchSalesmanDetails(sid: number): Promise<void> {
        return new Promise<void>((resolve) => {
            this.salesmenService
                .getSalesmanById(sid)
                .subscribe(
                    (response: HttpResponse<SalesmenDatapoint>): void => {
                        this.salesman = response.body;
                        console.log(this.salesman);
                        resolve();
                    }
                );
        });
    }

    fetchOrderDetails(gid: number, year: number): void {
        this.salesmenService
            .getSalesOrdersByGovernmentIdAndYear(gid, year)
            .subscribe(
                (response: HttpResponse<ProductSalesDatapoint[]>): void => {
                    this.salesOrders = response.body;
                    console.log('Sales Orders:', this.salesOrders);
                    console.log(response.body);
                },
                (error: any): void => {
                    console.error('Error:', error);
                    this.salesOrders = [];
                }
            );
    }

    savePerformanceRecord(): void {
        if (this.recordForm.valid) {
            const sid = this.route.snapshot.paramMap.get('sid');
            if (sid) {
                const year = this.recordForm.get('year')?.value as number;

                const competences: Competence[] = this.competencesControls.map(
                    (competence: FormGroup): Competence => {
                        const value = competence.value as Competence;

                        return new Competence(
                            '',
                            value.name,
                            value.targetValue,
                            value.actualValue,
                            0
                        );
                    }
                );

                const productsSales = this.salesOrders.map(
                    (order: ProductsSales): ProductsSales =>
                        new ProductsSales(
                            order.productId,
                            order.productName,
                            order.productDescription,
                            order.clients.map(
                                (client: ClientPurchase): ClientPurchase =>
                                    new ClientPurchase(
                                        client.customerName,
                                        client.rating,
                                        client.quantity,
                                        0
                                    )
                            )
                        )
                );

                console.log('ProductsSales:', productsSales);

                const performanceRecord = new PeformanceRecord(
                    '',
                    parseInt(sid, 10),
                    year,
                    productsSales,
                    competences,
                    0,
                    0,
                    0,
                    false,
                    ''
                );

                console.log(performanceRecord);

                // Speichern des PerformanceRecords
                this.salesmenService
                    .addPerformanceRecord(parseInt(sid, 10), performanceRecord)
                    .subscribe(
                        (response: HttpResponse<any>): void => {
                            // Antworttyp explizit angeben
                            console.log('API Response:', response);
                            alert('Performance record added!');
                            void this.router.navigate(['/salesmen', sid]);
                        },
                        (error: any): void => {
                            console.error(
                                'Error adding performance record:',
                                error
                            );
                            alert(
                                'An error occurred while adding the performance record.'
                            );
                        }
                    );
            }
        }
    }

    onGetOrderEvaluation(): void {
        const year = this.recordForm.get('year')?.value as number;

        console.log(this.salesman, this.salesman.code, year);
        if (this.salesman && this.salesman.code) {
            this.fetchOrderDetails(this.salesman.code, year);
        }
    }
}
