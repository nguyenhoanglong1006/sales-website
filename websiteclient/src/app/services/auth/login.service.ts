import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Globals } from '../../globals';

@Injectable({
    providedIn: 'root'
})
export class LoginService {

    constructor(private http: HttpClient, private globals: Globals) { }

    checkLoginAdmin(): Observable<{}> {
        return this.http.post(this.globals.BASE_API_URL + 'browsers/index/checklogin', { data: this.globals.USERS.get() }, this.globals.headersReject).pipe();
    }
    
}