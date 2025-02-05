import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class BonusService {

    constructor(private http: HttpClient) { }

    addBonus(sid: number, year: number, value: number): Observable<HttpResponse<any>> {
        const url = `${environment.apiEndpoint}/api/employees/${sid}/bonus`;
        return this.http.post<any>(url, { year, value }, { observe: 'response' });
    }

}
