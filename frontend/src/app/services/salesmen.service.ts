import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {SalesmenDatapoint} from '../interfaces/salesmen-datapoint';
import {PerformanceDatapoint} from '../interfaces/performance-datapoint';
import {Competence} from '../models/Competence';
import {SalesmenDatapointWithPerformanceYear} from '../interfaces/salesmen-datapoint-performance-year';

@Injectable({
    providedIn: 'root'
})
export class SalesmenService {

    constructor(private http: HttpClient) { }

    getSalesmen(): Observable<HttpResponse<SalesmenDatapoint[]>>{
        return this.http.get<SalesmenDatapoint[]>(environment.apiEndpoint + '/api/salesmen', {observe: 'response', withCredentials: true});
    }

    getSalesmanById(sid: number): Observable<HttpResponse<SalesmenDatapoint>> {
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands,max-len
        return this.http.get<SalesmenDatapoint>(environment.apiEndpoint + '/api/salesmen/' + sid, {observe: 'response', withCredentials: true});
    }

    getSalesmanPerformanceByYear(sid: number, year: number): Observable<HttpResponse<PerformanceDatapoint>> {
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands,max-len
        return this.http.get<PerformanceDatapoint>(environment.apiEndpoint + '/api/salesmen/' + sid + '/performance/' + year, {observe: 'response', withCredentials: true});
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type
    addPerformanceRecord(sid: number, record: { sid: number; year: number; competences: Competence[]}) {
        const url = environment.apiEndpoint + `/api/salesmen/${sid}/performance`;
        return this.http.post(url, record);
    }

    getSalesmenWithUnapprovedRecords(): Observable<HttpResponse<SalesmenDatapointWithPerformanceYear[]>> {
        return this.http.get<SalesmenDatapointWithPerformanceYear[]>(environment.apiEndpoint + '/api/unapprovedSalesmenRecords',
            {observe: 'response', withCredentials: true});
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type
    approvePerformanceRecord(sid: number, year: number, ceoApproval: boolean, remark: string) {
        const url = `/api/salesmen/${sid}/performance/${year}`;
        const record = { ceoApproval, remark };

        return this.http.put(url, record);
    }



}
