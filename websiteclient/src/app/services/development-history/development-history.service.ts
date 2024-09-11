import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Globals } from '../../globals';

@Injectable({
    providedIn: 'root'
})
export class DevelopmentHistoryService {

    constructor(
        private http: HttpClient,
        public globals: Globals
    ) { }

    getList(): Observable<{}> {
        return this.http.get<{}>(this.globals.BASE_API_URL + 'api/developmenthistory/getlist' + this.globals._params.process(), this.globals.headersReject).pipe();
    }

}
