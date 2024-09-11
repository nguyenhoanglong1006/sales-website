import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Globals } from '../../globals';

@Injectable({
    providedIn: 'root'
})
export class SearchService {

    constructor(
        private http: HttpClient,
        public globals: Globals
    ) { }


    search(params = {}): Observable<{}> {
        return this.http.get<{}>(this.globals.BASE_API_URL + 'api/search/get' + this.globals._params.process(params), this.globals.headersReject).pipe();
    }

    searchOrder(params = {}): Observable<{}> {
        return this.http.get<{}>(this.globals.BASE_API_URL + 'api/search/getorder' + this.globals._params.process(params), this.globals.headersReject).pipe();
    }

    getContentNew(params = {}): Observable<{}> {
        return this.http.get<{}>(this.globals.BASE_API_URL + 'api/search/getcontentnew' + this.globals._params.process(params), this.globals.headersReject).pipe();
    }

}
