import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { BonusDistribution, YearlyBonusStats } from '../interfaces/statistics-datapoint';

@Injectable({
    providedIn: 'root',
})
export class StatisticsService {
    constructor(private http: HttpClient) {}

    getBonusDistribution(): Observable<HttpResponse<BonusDistribution>> {
        const url = `${environment.apiEndpoint}/api/statistics/bonus-distribution`;
        return this.http.get<BonusDistribution>(url, {
            observe: 'response',
            withCredentials: true,
        });
    }

    getYearlyBonusStats(): Observable<HttpResponse<YearlyBonusStats>> {
        const url = `${environment.apiEndpoint}/api/statistics/yearly-bonus`;
        return this.http.get<YearlyBonusStats>(url, {
            observe: 'response',
            withCredentials: true,
        });
    }
}
