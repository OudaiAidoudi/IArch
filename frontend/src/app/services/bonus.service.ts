import {Injectable} from '@angular/core';
import {Bonus} from '../models/Bonus';
import {Observable, of} from 'rxjs';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class BonusService {
    private bonusesUrl = `${environment.apiEndpoint}/api/bonuses`; // URL to web api
    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        withCredentials: true
    };

    constructor(
        private http: HttpClient
    ) { }

    /** GET bonuses from the server */
    getBonuses(): Observable<HttpResponse<Bonus[]>> {
        return this.http.get<Bonus[]>(this.bonusesUrl + '/read/all', {
            observe: 'response',
            withCredentials: true
        });
    }

    /** GET single Bonus from the backend */
    getBonus(id: string): Observable<HttpResponse<Bonus>> {
        const url = `${this.bonusesUrl}/read/id/${id}`;
        return this.http.get<Bonus>(url, {
            observe: 'response',
            withCredentials: true
        });
    }

    /** UPDATE single bonus */
    updateBonus(bonus: Bonus): Observable<any> {
        const url = `${this.bonusesUrl}/update/id/${bonus._id}`;
        return this.http.put(url, bonus, this.httpOptions);
    }

    /** ADD new bonus */
    addBonus(bonus: Bonus): Observable<Bonus> {
        const url = `${this.bonusesUrl}/create`;
        return this.http.post<Bonus>(url, bonus, this.httpOptions);
    }

    /** DELETE: delete the bonus from the server */
    deleteBonus(id: string): Observable<Bonus> {
        const url = `${this.bonusesUrl}/delete/id/${id}`;

        return this.http.delete<Bonus>(url, this.httpOptions);
    }

    /** SEARCH after bonuses */
    searchBonus(term: number): Observable<any[]> {
        if (!term) {
            // if not search term, return empty bonus array.
            return of([]);
        }
        return this.http.get<Bonus[]>(`${this.bonusesUrl}/read/year/${term}`, {
            withCredentials: true
        });
    }

    calculateAllBonuses(year: number): Observable<HttpResponse<Bonus[]>> {
        const url = `${this.bonusesUrl}/calculateBonus/all/${year}`;
        return this.http.get<Bonus[]>(url, {
            observe: 'response',
            withCredentials: true
        });
    }
}
