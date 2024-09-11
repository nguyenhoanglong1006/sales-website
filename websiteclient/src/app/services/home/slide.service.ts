import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Globals } from '../../globals';

@Injectable({
    providedIn: 'root'
})
export class SlideService {

    constructor(private http: HttpClient, private globals: Globals) { }

    getSlide(params = {}): Observable<{}> {
        return this.http.get<{}>(this.globals.BASE_API_URL + 'api/home/getlistsliders' + this.globals._params.process(params), this.globals.headersReject).pipe();
    }



}
