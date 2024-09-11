import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Globals } from '../../globals';

@Injectable({
    providedIn: 'root'
})
export class FooterService {

    constructor(
        private http: HttpClient,
        private globals: Globals
    ) { }


    getAddress(params = {}): Observable<{}> {
        return this.http.get<{}>(this.globals.BASE_API_URL + 'api/home/getaddressfooter' + this.globals._params.process(params), this.globals.headersReject).pipe();
    }
}