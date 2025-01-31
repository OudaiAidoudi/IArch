import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {SalesMan} from '../models/SalesMan';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SalesManService {
    private salesManUrl = `${environment.apiEndpoint}/api/salesmen`;

    constructor(private http: HttpClient) {
    }

    getAllSalesMan(): Observable<HttpResponse<SalesMan[]>> {
        return this.http.get<SalesMan[]>(environment.apiEndpoint + '/api/salesmen/read/all', {
            observe: 'response',
            withCredentials: true
        });
    }

    getSalesMan(salesManID: number): Observable<HttpResponse<SalesMan>> {
        const url = `${this.salesManUrl}/read/id/${salesManID}`;
        return this.http.get<SalesMan>(url, {
            observe: 'response',
            withCredentials: true
        });
    }

    deleteSalesman(salesmanid: string): Observable<any> {
      return this.http.delete(environment.apiEndpoint + '/api/salesmen/delete/id/' + salesmanid, {
            withCredentials: true
        })
    }

    public saveSalesman(salesman: SalesMan): Observable<any> {
        const url = environment.apiEndpoint + '/api/salesmen/create';
        return this.http.post<any>(url, salesman,  {
            withCredentials: true
        });
    }

    public updateSalesman(id: string, salesman: SalesMan): Observable<any> {
        const url = environment.apiEndpoint + '/api/salesmen/update/' + id;
        return this.http.put<any>(url, salesman,  {
            withCredentials: true
        });
    }
    syncSalesman(): Observable<any> {
        const url = environment.apiEndpoint + '/api/salesmen/getApiSalesmen';
        return this.http.get<any>(url, {withCredentials: true});
    }

}
