import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Globals } from '../../globals';

@Injectable({
    providedIn: 'root'
})
export class SupportService {

    constructor(private http: HttpClient, private globals: Globals) { }

    getFaq(): Observable<{}> {
        return this.http.get<{}>(this.globals.BASE_API_URL + 'api/support/getfaq' + this.globals._params.process(), this.globals.headersReject).pipe();
    }

    getDetailFaq(params): Observable<{}> {
        return this.http.get<{}>(this.globals.BASE_API_URL + 'api/support/getdetailfaq' + this.globals._params.process(params), this.globals.headersReject).pipe();
    }

    getContactContent(): Observable<{}> {
        return this.http.get<{}>(this.globals.BASE_API_URL + 'api/support/getcontactcontent' + this.globals._params.process(), this.globals.headersReject).pipe();
    }
    addContact(data = {}): Observable<{}> {
        return this.http.post<any>(this.globals.BASE_API_URL + 'api/support/addcontact', { data: data }, this.globals.headersReject).pipe();
    }
    searchFaq(params): Observable<{}> {
        return this.http.get<{}>(this.globals.BASE_API_URL + 'api/support/getvaluesearch' + this.globals._params.process(params), this.globals.headersReject).pipe();
    }
}
