import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Globals } from '../../globals';

@Injectable({
    providedIn: 'root'
})
export class CustomerService {

    constructor(private http: HttpClient, private globals: Globals) { }
    
    checkLoginCustomer(data = {}): Observable<{}> {
        return this.http.post<any>(this.globals.BASE_API_URL + 'api/customer/login', { data: data }, this.globals.headersReject).pipe();
    }

    addCustomer(data = {}): Observable<{}> {
        return this.http.post<any>(this.globals.BASE_API_URL + 'api/customer/addcustomer', { data: data }, this.globals.headersReject).pipe();
    }

    getOrderList(params = {}): Observable<{}> {
        return this.http.get<{}>(this.globals.BASE_API_URL + 'api/customer/getorderlist' + this.globals._params.process(params), this.globals.headersReject).pipe();
    }

    getInfo(params = {}): Observable<{}> {
        return this.http.get<{}>(this.globals.BASE_API_URL + 'api/customer/getcustomer' + this.globals._params.process(params), this.globals.headersReject).pipe();
    }

    processInfo(data = {}): Observable<{}> {
        return this.http.post<any>(this.globals.BASE_API_URL + 'api/customer/processinfo', { data: data }, this.globals.headersReject).pipe();
    }

    changePass(data = {}): Observable<{}> {
        return this.http.post<any>(this.globals.BASE_API_URL + 'api/customer/changepass', { data: data }, this.globals.headersReject).pipe();
    }
}