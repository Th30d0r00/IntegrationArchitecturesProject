import {Component, OnInit} from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { SalesmenService } from '../../services/salesmen.service';
import {ActivatedRoute, Router} from '@angular/router';
import {SalesmenDatapoint} from '../../interfaces/salesmen-datapoint';
import {Competence} from '../../models/Competence';
import {PeformanceRecord} from '../../models/PeformanceRecord';

@Component({
    selector: 'app-add-performance-record-page',
    templateUrl: './add-performance-record-page.component.html',
    styleUrls: ['./add-performance-record-page.component.css']
})
export class AddPerformanceRecordPageComponent implements OnInit {
    recordForm: FormGroup;
    salesman: SalesmenDatapoint;

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

    get formAsJson(): string {
        return JSON.stringify(this.recordForm.value, null, 2);
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

    savePerformanceRecord(): void {
        if (this.recordForm.valid) {
            const sid = this.route.snapshot.paramMap.get('sid');
            if (sid) {

                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                const year = this.recordForm.get('year')?.value;

                // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
                const competences: Competence[] = this.competencesControls.map(competence => new Competence(
                    '',
                    competence.value.name,
                    competence.value.targetValue,
                    competence.value.actualValue,
                    0
                ));

                const performanceRecord = new PeformanceRecord(
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                    '', parseInt(sid, 10), year, competences, 0, false, '');

                console.log(performanceRecord);

                this.salesmenService.addPerformanceRecord(parseInt(sid, 10), performanceRecord).subscribe(response => {
                    console.log('API Response:', response);
                    alert('Leistungsdaten erfolgreich gespeichert!');
                    this.router.navigate(['/salesmen', sid]);
                });
            }

        }
    }
}
