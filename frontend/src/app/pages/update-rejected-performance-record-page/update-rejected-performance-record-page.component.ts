import {Component, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {SalesmenDatapoint} from '../../interfaces/salesmen-datapoint';
import {ProductSalesDatapoint} from '../../interfaces/productsSales-datapoint';
import {SalesmenService} from '../../services/salesmen.service';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {Competence} from '../../models/Competence';
import {PeformanceRecord} from '../../models/PeformanceRecord';
import {ApprovalStatus} from '../../models/Approval-status';
import {PerformanceDatapoint} from '../../interfaces/performance-datapoint';

@Component({
    selector: 'app-update-rejected-performance-record-page',
    templateUrl: './update-rejected-performance-record-page.component.html',
    styleUrls: ['./update-rejected-performance-record-page.component.css']
})
export class UpdateRejectedPerformanceRecordPageComponent implements OnInit {
    recordForm: FormGroup;
    salesman: SalesmenDatapoint;
    performanceData: PerformanceDatapoint;

    constructor(
        private salesmenService: SalesmenService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    async ngOnInit(): Promise<void> {
        this.initializeForm();
        console.log(this.recordForm);
        const sid = this.route.snapshot.paramMap.get('sid');
        const year = this.route.snapshot.paramMap.get('year');

        if (!this.performanceData || !this.salesman) {
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
    }

    private initializeForm(): void {
        this.recordForm = new FormGroup({
            competences: new FormArray([])
        });
    }

    async fetchSalesmanDetails(sid: number): Promise<void> {
        return new Promise<void>((resolve): void => {
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

    fetchPerformanceData(sid: number, year: number): void {
        this.salesmenService.getSalesmanPerformanceByYear(sid, year).subscribe(
            (response: HttpResponse<PerformanceDatapoint>): void => {
                this.performanceData = response.body;
                console.log('Performance data:', this.performanceData);

                if (this.performanceData) {
                    this.populateCompetences();
                }
            },
            (error): void => {
                console.error('Error fetching performance data:', error);
            }
        );
    }

    private populateCompetences(): void {
        const competencesArray = this.recordForm.get('competences') as FormArray;
        competencesArray.clear();

        if (this.performanceData && this.performanceData.competences) {
            this.performanceData.competences.forEach((competence): void => {
                competencesArray.push(
                    new FormGroup({
                        name: new FormControl(competence.name),
                        targetValue: new FormControl(competence.targetValue, [
                            (value): ValidationErrors => Validators.required(value),
                            (value): ValidationErrors => Validators.min(1)(value),
                            (value): ValidationErrors => Validators.max(5)(value),
                        ]),
                        actualValue: new FormControl(competence.actualValue, [
                            (value): ValidationErrors => Validators.required(value),
                            (value): ValidationErrors => Validators.min(0)(value),
                            (value): ValidationErrors => Validators.max(5)(value),
                        ]),
                    })
                );
            });
        }

    }

    get competencesControls(): FormGroup[] {
        return (this.recordForm.get('competences') as FormArray).controls as FormGroup[];
    }


    onSubmit(): void {
        this.updatePerformanceRecord();
    }

    updatePerformanceRecord(): void {
        if (this.recordForm.valid) {
            const sid = this.route.snapshot.paramMap.get('sid');
            if (sid) {

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

                const performanceRecord = new PeformanceRecord(
                    '',
                    parseInt(sid, 10),
                    this.performanceData.year,
                    this.performanceData.productSales,
                    competences,
                    this.performanceData.bonusA,
                    0,
                    0,
                    ApprovalStatus.Waiting,
                    ''
                );

                console.log(performanceRecord);

                // updaten des PerformanceRecords
                this.salesmenService
                    .updatePerformanceRecord(parseInt(sid, 10), performanceRecord)
                    .subscribe(
                        (response: HttpResponse<any>): void => {
                            // Antworttyp explizit angeben
                            console.log('API Response:', response);
                            alert('Performance record updated!');
                            void this.router.navigate(['/salesmen', sid]);
                        },
                        (error: any): void => {
                            console.error(
                                'Error updating performance record:',
                                error
                            );
                            if ((error as HttpErrorResponse).status === 409) {
                                alert(
                                    (
                                        (error as HttpErrorResponse)
                                            .error as Error
                                    ).message
                                );
                                return;
                            }
                            alert(
                                'An error occurred while updating the performance record.'
                            );
                        }
                    );
            }
        }
    }

    protected readonly ApprovalStatus = ApprovalStatus;
}
