import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class BonusService {

    constructor(private http: HttpClient) { }

    addBonus(sid: number, year: number, value: number) {
        const url = environment.apiEndpoint + `/api/employees/${sid}/bonus`;
        return this.http.post(url, { year, value });
    }
}
