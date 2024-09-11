import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Globals } from '../../globals';

@Injectable({
    providedIn: 'root'
})
export class HomeService {

    constructor(private http: HttpClient, public globals: Globals) { }

    getProduct(params = {}): Observable<{}> {
        return this.http.get<{}>(this.globals.BASE_API_URL + 'api/home/getproduct' + this.globals._params.process(params), this.globals.headersReject).pipe();
    }

    getAboutus(params = {}): Observable<{}> {
        return this.http.get<{}>(this.globals.BASE_API_URL + 'api/home/getaboutus' + this.globals._params.process(params), this.globals.headersReject).pipe();
    }

    getNews(params = {}): Observable<{}> {
        return this.http.get<{}>(this.globals.BASE_API_URL + 'api/home/getnews' + this.globals._params.process(params), this.globals.headersReject).pipe();
    }

    getCategories(params = {type: 3}): Observable<{}> {
        return this.http.get<{}>(this.globals.BASE_API_URL + 'api/home/getcategories' + this.globals._params.process(params), this.globals.headersReject).pipe();
    }

    getNewsDidPin(params = {}): Observable<{}> {
        return this.http.get<{}>(this.globals.BASE_API_URL + 'api/home/getnewsdidpin' + this.globals._params.process(params), this.globals.headersReject).pipe();
    }

    getBanner(params = {}): Observable<{}> {
        return this.http.get<{}>(this.globals.BASE_API_URL + 'api/home/getbanner' + this.globals._params.process(params), this.globals.headersReject).pipe();
    }
}
