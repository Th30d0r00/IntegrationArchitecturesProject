import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {SalesmenDatapoint} from '../interfaces/salesmen-datapoint';
import {PerformanceDatapoint} from '../interfaces/performance-datapoint';
import {Competence} from '../models/Competence';
import {SalesmenDatapointWithPerformanceYear} from '../interfaces/salesmen-datapoint-performance-year';
import {ProductSalesDatapoint} from '../interfaces/productsSales-datapoint';
import {ApprovalStatus} from '../models/Approval-status';

@Injectable({
    providedIn: 'root'
})
export class SalesmenService {

    constructor(private http: HttpClient) { }

    getSalesmen(): Observable<HttpResponse<SalesmenDatapoint[]>> {
        const url = `${environment.apiEndpoint}/api/salesmen`;
        return this.http.get<SalesmenDatapoint[]>(url, { observe: 'response', withCredentials: true });
    }

    getSalesmanById(sid: number): Observable<HttpResponse<SalesmenDatapoint>> {
        const url = `${environment.apiEndpoint}/api/salesmen/${sid}`;
        return this.http.get<SalesmenDatapoint>(url, { observe: 'response', withCredentials: true });
    }

    getPerformanceRecords(sid: number): Observable<HttpResponse<PerformanceDatapoint[]>> {
        const url = `${environment.apiEndpoint}/api/salesmen/${sid}/performance`;
        return this.http.get<PerformanceDatapoint[]>(url, { observe: 'response', withCredentials: true });
    }

    getSalesmanPerformanceByYear(sid: number, year: number): Observable<HttpResponse<PerformanceDatapoint>> {
        const url = `${environment.apiEndpoint}/api/salesmen/${sid}/performance/${year}`;
        return this.http.get<PerformanceDatapoint>(url, { observe: 'response', withCredentials: true });
    }

    getApprovedPerformanceRecords(sid: number): Observable<HttpResponse<PerformanceDatapoint[]>> {
        const url = `${environment.apiEndpoint}/api/salesmen/${sid}/performance/approved`;
        return this.http.get<PerformanceDatapoint[]>(url, { observe: 'response', withCredentials: true });
    }

    addPerformanceRecord(sid: number, record: { sid: number; year: number; competences: Competence[] }): Observable<HttpResponse<any>> {
        const url = `${environment.apiEndpoint}/api/salesmen/${sid}/performance`;
        return this.http.post<any>(url, record, { observe: 'response' });
    }

    getSalesmenWithUnapprovedRecords(): Observable<HttpResponse<SalesmenDatapointWithPerformanceYear[]>> {
        const url = `${environment.apiEndpoint}/api/unapprovedSalesmenRecords`;
        return this.http.get<SalesmenDatapointWithPerformanceYear[]>(url, { observe: 'response', withCredentials: true });
    }

    approvePerformanceRecord(sid: number, year: number, approvalStatus: ApprovalStatus, remark: string): Observable<HttpResponse<any>> {
        const url = `${environment.apiEndpoint}/api/salesmen/${sid}/performance/${year}`;
        const record = { approvalStatus, remark };
        return this.http.put<any>(url, record, { observe: 'response' });
    }

    getSalesOrdersByGovernmentIdAndYear(gid: number, year: number): Observable<HttpResponse<ProductSalesDatapoint[]>> {
        const url = `${environment.apiEndpoint}/api/salesorders/${gid}/${year}`;
        return this.http.get<ProductSalesDatapoint[]>(url, {
            observe: 'response',
            withCredentials: true
        });
    }




}
